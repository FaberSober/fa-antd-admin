package com.faber.api.flow.form.biz;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.faber.api.flow.form.entity.FlowForm;
import com.faber.api.flow.form.mapper.FlowFormMapper;
import com.faber.api.flow.form.vo.req.CreateColumnReqVo;
import com.faber.api.flow.form.vo.req.CreateFormTableReqVo;
import com.faber.api.flow.form.vo.ret.TableColumnVo;
import com.faber.api.flow.form.vo.ret.TableInfoVo;
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

    private static final List<String> DATA_TYPES_LENGTH = List.of("varchar", "int", "bigint");
    private static final List<String> DATA_TYPES_PRECISION = List.of("decimal", "numeric");

    public void createFormTable(CreateFormTableReqVo reqVo) throws SQLException {
        // 校验表名必须以ff_开头
        String tableName = reqVo.getTableName();
        if (tableName == null || !tableName.startsWith("ff_")) {
            throw new IllegalArgumentException("表名必须以ff_开头");
        }

        // 创建基础表
        String createTableSql = String.format(
            "CREATE TABLE `%s` (\n" +
            "  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT 'ID',\n" +
            "  `crt_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',\n" +
            "  `crt_user` varchar(32) NOT NULL COMMENT '创建用户ID',\n" +
            "  `upd_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',\n" +
            "  `upd_user` varchar(32) DEFAULT NULL COMMENT '更新用户ID',\n" +
            "  `deleted` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',\n" +
            "  PRIMARY KEY (`id`)\n" +
            ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
            tableName
        );

        Connection conn = dataSource.getConnection();
        SqlUtils.executeSql(conn, createTableSql);
    }

    public TableInfoVo queryTableStructure(String tableName) throws SQLException {
        TableInfoVo tableInfo = new TableInfoVo();
        tableInfo.setTableName(tableName);

        List<TableColumnVo> columns = baseMapper.getTableColumns(tableName);
        tableInfo.setColumns(columns);
        tableInfo.setExist(!columns.isEmpty());

        return tableInfo;
    }

    public void createColumn(CreateColumnReqVo reqVo) throws SQLException {
        String tableName = reqVo.getTableName();
        TableColumnVo column = reqVo.getColumn();

        // 校验表名必须以ff_开头
        if (tableName == null || !tableName.startsWith("ff_")) {
            throw new IllegalArgumentException("表名必须以ff_开头");
        }

        StringBuilder sb = new StringBuilder();
        sb.append("ALTER TABLE `").append(tableName).append("` ADD COLUMN `").append(column.getField()).append("` ");
        
        if (DATA_TYPES_LENGTH.contains(column.getDataType()) && column.getLength() != null) {
            sb.append(column.getDataType()).append("(").append(column.getLength()).append(") ");
        } else if (DATA_TYPES_PRECISION.contains(column.getDataType()) && column.getPrecision() != null && column.getScale() != null) {
            sb.append(column.getDataType()).append("(").append(column.getPrecision()).append(",").append(column.getScale()).append(") ");
        } else {
            sb.append(column.getDataType()).append(" ");
        }

        if ("NO".equalsIgnoreCase(column.getNullable())) {
            sb.append("NOT NULL ");
        } else {
            sb.append("NULL ");
        }

        if (column.getDefaultValue() != null) {
            sb.append("DEFAULT '").append(column.getDefaultValue()).append("' ");
        }

        if (column.getComment() != null) {
            sb.append("COMMENT '").append(column.getComment()).append("' ");
        }
        sb.append(";");

        String sql = sb.toString();

        Connection conn = dataSource.getConnection();
        SqlUtils.executeSql(conn, sql);
    }


    public void updateColumn(CreateColumnReqVo reqVo) throws SQLException {
        String tableName = reqVo.getTableName();
        TableColumnVo column = reqVo.getColumn();

        // 校验表名必须以ff_开头
        if (tableName == null || !tableName.startsWith("ff_")) {
            throw new IllegalArgumentException("表名必须以ff_开头");
        }
        StringBuilder sb = new StringBuilder();
        sb.append("ALTER TABLE `").append(tableName).append("` MODIFY COLUMN `").append(column.getField()).append("` ");
        if (DATA_TYPES_LENGTH.contains(column.getDataType()) && column.getLength() != null) {
            sb.append(column.getDataType()).append("(").append(column.getLength()).append(") ");
        } else if (DATA_TYPES_PRECISION.contains(column.getDataType()) && column.getPrecision() != null && column.getScale() != null) {
            sb.append(column.getDataType()).append("(").append(column.getPrecision()).append(",").append(column.getScale()).append(") ");
        } else {
            sb.append(column.getDataType()).append(" ");
        }
        if ("NO".equalsIgnoreCase(column.getNullable())) {
            sb.append("NOT NULL ");
        } else {
            sb.append("NULL ");
        }
        if (column.getDefaultValue() != null) {
            sb.append("DEFAULT '").append(column.getDefaultValue()).append("' ");
        }
        if (column.getComment() != null) {
            sb.append("COMMENT '").append(column.getComment()).append("' ");
        }
        sb.append(";");
        String sql = sb.toString();
        Connection conn = dataSource.getConnection();
        SqlUtils.executeSql(conn, sql);
    }

    public void deleteColumn(com.faber.api.flow.form.vo.req.DeleteColumnReqVo reqVo) throws SQLException {
        String tableName = reqVo.getTableName();
        String columnName = reqVo.getColumn();

        // 校验表名必须以ff_开头
        if (tableName == null || !tableName.startsWith("ff_")) {
            throw new IllegalArgumentException("表名必须以ff_开头");
        }

        String sql = String.format("ALTER TABLE `%s` DROP COLUMN `%s`;", tableName, columnName);

        Connection conn = dataSource.getConnection();
        SqlUtils.executeSql(conn, sql);
    }

}