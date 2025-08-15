package com.faber.api.base.admin.biz;

import cn.hutool.core.collection.ListUtil;
import cn.hutool.core.exceptions.ExceptionUtil;
import cn.hutool.core.util.ClassUtil;
import cn.hutool.extra.spring.SpringUtil;
import com.faber.api.base.admin.entity.SystemUpdateLog;
import com.faber.api.base.admin.mapper.SystemUpdateLogMapper;
import com.faber.api.base.admin.vo.dto.FaSqlHeader;
import com.faber.api.base.rbac.biz.RbacRoleMenuBiz;
import com.faber.core.config.dbinit.DbInit;
import com.faber.core.config.dbinit.vo.FaDdl;
import com.faber.core.config.dbinit.vo.FaDdlAddColumn;
import com.faber.core.config.dbinit.vo.FaDdlSql;
import com.faber.core.config.dbinit.vo.FaDdlTableCreate;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.utils.FaDateUtils;
import com.faber.core.utils.FaResourceUtils;
import com.faber.core.utils.SqlUtils;
import com.faber.core.web.biz.BaseBiz;
import lombok.SneakyThrows;
import org.apache.ibatis.jdbc.ScriptRunner;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import javax.sql.DataSource;
import java.io.IOException;
import java.io.StringReader;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * BASE-系统版本更新日志表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-08-17 17:10:02
 */
@Service
public class SystemUpdateLogBiz extends BaseBiz<SystemUpdateLogMapper, SystemUpdateLog> {

    @Resource DataSource dataSource;
    @Resource RbacRoleMenuBiz rbacRoleMenuBiz;

    public static final String SQL_SPLITTER = "-- ------------------------- info -------------------------";

    public void initDb() {
        BaseContextHandler.useAdmin();

        // 1. 初始化数据
        ClassUtil.scanPackageBySuper("com.faber", DbInit.class)
                .stream().map(clazz -> (DbInit) SpringUtil.getBean(clazz))
                .sorted(Comparator.comparing(DbInit::getOrder))
                .forEach(i -> initOneBuzz(i));

        // 2. 给超级管理员角色赋权限
        rbacRoleMenuBiz.initAdminRoleMenu();
    }

    @SneakyThrows
    private void initOneBuzz(DbInit dbInit) {
        // 1. 获取数据库操作信息
        String no = dbInit.getNo();
        String name = dbInit.getName();

        // 2. 查询数据库当前记录最新的版本
        SystemUpdateLog latestLog = this.getLatestByNo(no);

        // 3. 获取sql文件列表
        ResourcePatternResolver resolver = new PathMatchingResourcePatternResolver();
        org.springframework.core.io.Resource[] resources = resolver.getResources("classpath*:sql/" + no + "/*.sql");

        // 4. 解析sql文件
        Connection conn = dataSource.getConnection();
        try {
            ListUtil.of(resources).stream().map(resource -> {
                        try {
                            return getSqlFileHeader(resource);
                        } catch (IOException e) {
                            throw new RuntimeException(e);
                        }
                    }).filter(i -> i != null)
                    .sorted(Comparator.comparing(FaSqlHeader::getVer)) // 按照版本号升序排列
                    .filter(i -> {
                        if (latestLog == null) return true;
                        return i.getVer() > latestLog.getVer();
                    }) // 过滤需要升级的sql
//                .sorted(Comparator.comparing(FaSqlHeader::getVer)) // 按照版本号升序排列
                    .forEach(i -> {
                        // 执行升级sql
                        String errorMsg = "";
                        try {
                            _logger.info("执行升级sql: no: {} name: {} ver: {} verNo: {}", no, name, i.getVer(), i.getVerNo());
                            SqlUtils.executeSql(conn, i.getSql());
                            Thread.sleep(1000);
                        } catch (Exception e) {
                            _logger.error(e.getMessage(), e);
                            errorMsg = ExceptionUtil.stacktraceToString(e);
                        }

                        // 2. 记录升级日志
                        SystemUpdateLog updateLog = new SystemUpdateLog();
                        updateLog.setNo(no);
                        updateLog.setName(name);
                        updateLog.setVer(i.getVer());
                        updateLog.setVerNo(i.getVerNo());
                        updateLog.setRemark(i.getInfo());
                        updateLog.setLog(i.getSql() + "\r\n" + errorMsg);

                        super.save(updateLog);
                    });
        } finally {
            conn.close();
        }
    }

    private FaSqlHeader getSqlFileHeader(org.springframework.core.io.Resource resource) throws IOException {
        String sqlStr = FaResourceUtils.getResourceString(resource);
        if (!sqlStr.contains(SQL_SPLITTER)) {
            throw new RuntimeException("SQL初始化文件未包含正确的文件头，请检查，文件名：" + resource.getFilename());
        }
        String info = sqlStr.substring(sqlStr.indexOf(SQL_SPLITTER) + SQL_SPLITTER.length(), sqlStr.lastIndexOf(SQL_SPLITTER));
        String[] ss = info.trim().split("\n");

        FaSqlHeader header = new FaSqlHeader();
        header.setSql(sqlStr);

        for (String line : ss) {
            String key = line.substring(0, line.indexOf(":")).substring(5);
            String value = line.substring(line.indexOf(":") + 1).trim();
//            log.debug(key + ":" + value);

            switch (key) {
                case "ver":
                    header.setVer(Long.parseLong(value.replace("_", "").replace("L", "")));

                    String[] verSs = value.replace("L", "").split("_");
                    String verNo = "V" + Integer.parseInt(verSs[0]) + "." + Integer.parseInt(verSs[1]) + "." + Integer.parseInt(verSs[2]);
                    header.setVerNo(verNo);
                    break;
                case "info":
                    header.setInfo(value);
                    break;
            }
        }

        return header;
    }

    /**
     * 查询数据库当前记录最新的版本
     *
     * @param no
     * @return
     */
    public SystemUpdateLog getLatestByNo(String no) {
        try {
            return lambdaQuery()
                    .eq(SystemUpdateLog::getNo, no)
                    .orderByDesc(SystemUpdateLog::getVer)
                    .last("limit 1")
                    .one();
        } catch (Exception e) {
            _logger.error(e.getMessage(), e);
        }
        return null;
    }

}
