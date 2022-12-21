package com.faber.api.base.admin.biz;

import cn.hutool.extra.spring.SpringUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.faber.api.base.admin.entity.SystemUpdateLog;
import com.faber.api.base.admin.mapper.SystemUpdateLogMapper;
import com.faber.core.web.biz.BaseBiz;
import com.faber.core.utils.FaResourceUtils;
import org.apache.ibatis.jdbc.ScriptRunner;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import javax.sql.DataSource;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Date;

/**
 * BASE-系统版本更新日志表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-08-17 17:10:02
 */
@Service
public class SystemUpdateLogBiz extends BaseBiz<SystemUpdateLogMapper, SystemUpdateLog> {

    /**
     * 初始化&更新数据库。
     * 读取src/main/resources/data/updateLog.json文件，执行导入sql。
     */
    public void initAndUpdateDb() throws IOException, SQLException {
        JSONObject json = FaResourceUtils.getResourceJson("classpath:data/updateLog.json");

        // 获取配置的数据源
        DataSource dataSource = SpringUtil.getBean(DataSource.class);
        Connection conn = dataSource.getConnection();

        int curVer = baseMapper.getCurVerId();
        JSONArray logs = json.getJSONArray("logs");
        for (int i = 0; i < logs.size(); i++) {
            JSONObject log = logs.getJSONObject(i);

            int ver = log.getInt("ver");
            if (ver <= curVer) continue;

            // 记录执行日志
            String verNo = log.getStr("verNo");
            String remark = log.getStr("remark");
            String sql = log.getStr("sql");

            SystemUpdateLog logEntity = new SystemUpdateLog();
            logEntity.setVer(ver);
            logEntity.setVerNo(verNo);
            logEntity.setRemark(remark);
            logEntity.setCrtTime(new Date());
            save(logEntity);

            // 按行读取
            File sqlFile = ResourceUtils.getFile("classpath:data/sql/" + sql);

            // 执行sql脚本
            ScriptRunner runner = new ScriptRunner(conn);
            runner.setFullLineDelimiter(false);
            runner.setDelimiter(";");//语句结束符号设置
            runner.setLogWriter(null);//日志数据输出，这样就不会输出过程
            runner.setSendFullScript(false);
            runner.setAutoCommit(true);
            runner.setStopOnError(true);
            runner.runScript(new InputStreamReader(new FileInputStream(sqlFile), "utf8"));
            _logger.info(String.format("【%s】执行成功", sql));
        }
    }

}