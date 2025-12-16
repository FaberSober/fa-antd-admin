package com.faber.api.flow.form.biz;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.faber.api.flow.form.entity.FlowForm;
import com.faber.api.flow.form.mapper.FlowFormMapper;
import com.faber.api.flow.form.vo.req.CreateFormTableReqVo;
import com.faber.core.utils.SqlUtils;
import com.faber.core.web.biz.BaseBiz;

import jakarta.annotation.Resource;

/**
 * FLOW-流程表单
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-12-16 15:43:41
 */
@Service
public class FlowFormBiz extends BaseBiz<FlowFormMapper,FlowForm> {

    @Resource DataSource dataSource;

    public void createFormTable(CreateFormTableReqVo reqVo) throws SQLException {
        // 校验表名必须以ff_开头
        String tableName = reqVo.getTableName();
        if (tableName == null || !tableName.startsWith("ff_")) {
            throw new IllegalArgumentException("表名必须以ff_开头");
        }

        // 创建基础表
        String createTableSql = String.format(
            "CREATE TABLE `%s` (\n" +
            "  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,\n" +
            "  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,\n" +
            "  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,\n" +
            "  PRIMARY KEY (`id`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4",
            tableName
        );

        Connection conn = dataSource.getConnection();
        SqlUtils.executeSql(conn, createTableSql);
    }

}