package com.faber.admin.biz;

import cn.hutool.extra.spring.SpringUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import com.faber.admin.entity.SystemUpdateLog;
import com.faber.admin.mapper.SystemUpdateLogMapper;
import com.faber.common.biz.BaseBiz;
import com.faber.common.util.ResourceUtils;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.IOException;
import java.sql.SQLException;

/**
 * BASE-系统版本更新日志表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-08-17 17:10:02
 */
@Service
public class SystemUpdateLogBiz extends BaseBiz<SystemUpdateLogMapper,SystemUpdateLog> {

    /**
     * 初始化数据库。
     * 读取src/main/resources/data/updateLog.json文件，执行导入sql。
     */
    public void initAndUpdateDb() throws IOException, SQLException {
        JSONObject json = ResourceUtils.getResourceJson("classpath:data/updateLog.json");

        // 获取配置的数据源
        DataSource dataSource = SpringUtil.getBean(DataSource.class);

        int curVer = mapper.getCurVerId();
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

            // 执行sql
            JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
            jdbcTemplate.execute(sql);
        }
    }

}