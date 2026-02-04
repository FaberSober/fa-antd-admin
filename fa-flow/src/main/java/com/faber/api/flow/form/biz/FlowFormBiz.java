package com.faber.api.flow.form.biz;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.sql.DataSource;

import org.springframework.stereotype.Service;

import com.faber.api.flow.form.entity.FlowForm;
import com.faber.api.flow.form.entity.FlowFormTable;
import com.faber.api.flow.form.mapper.FlowFormMapper;
import com.faber.api.flow.form.vo.config.FlowFormConfig;
import com.faber.api.flow.form.vo.config.FlowFormDataConfig;
import com.faber.api.flow.form.vo.config.FlowFormItem;
import com.faber.api.flow.form.vo.req.CreateColumnReqVo;
import com.faber.api.flow.form.vo.req.CreateFormTableReqVo;
import com.faber.api.flow.form.vo.req.SaveFormDataReqVo;
import com.faber.api.flow.form.vo.ret.TableColumnVo;
import com.faber.api.flow.form.vo.ret.TableInfoVo;
import com.faber.core.exception.BuzzException;
import com.faber.core.service.FaFlowService;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.vo.utils.FaOption;
import com.faber.core.web.biz.BaseBiz;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import cn.hutool.core.util.StrUtil;
import cn.hutool.db.meta.Column;
import cn.hutool.db.meta.MetaUtil;
import cn.hutool.db.meta.Table;
import cn.hutool.db.sql.SqlExecutor;
import cn.hutool.json.JSONUtil;
import jakarta.annotation.Resource;
import lombok.Cleanup;

/**
 * FLOW-流程表单
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-12-16 15:43:41
 */
@Service
public class FlowFormBiz extends BaseBiz<FlowFormMapper,FlowForm> implements FaFlowService {

    @Resource DataSource dataSource;
    @Resource FlowFormTableBiz flowFormTableBiz;

    private static final List<String> DATA_TYPES_LENGTH = List.of("varchar", "int", "bigint");
    private static final List<String> DATA_TYPES_PRECISION = List.of("decimal", "numeric");

    public void createFormTable(CreateFormTableReqVo reqVo) throws SQLException {
        // 校验表名必须以ff_开头
        String tableName = reqVo.getTableName();
        String comment = reqVo.getComment();
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
                ") ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='%s';",
                tableName,
                comment == null ? "" : comment.replace("'", "''")
            );

        @Cleanup Connection conn = dataSource.getConnection();
        SqlExecutor.execute(conn, createTableSql);
    }

    public TableInfoVo queryTableStructure(String tableName) throws SQLException {
        TableInfoVo tableInfo = new TableInfoVo();
        tableInfo.setTableName(tableName);

        // 使用 Hutool 的 MetaUtil 来获取表结构
        Table tableMeta = MetaUtil.getTableMeta(dataSource, tableName);
        if (tableMeta == null) {
            tableInfo.setExist(false);
            return tableInfo;
        }
        tableInfo.setExist(true);
        tableInfo.setTableComment(tableMeta.getComment());
        // getPkNames() 返回 Set<String>，需要转换为 String
        // 通常表只有一个主键，取第一个
        Set<String> pkNames = tableMeta.getPkNames();
        String pkField = (pkNames != null && !pkNames.isEmpty()) ? pkNames.iterator().next() : null;
        tableInfo.setPkField(pkField);
        
        // List<TableColumnVo> columns = new ArrayList<>();
        // for (Column column : tableMeta.getColumns()) {
        //     TableColumnVo tableColumnVo = new TableColumnVo();
        //     tableColumnVo.setField(column.getName());
        //     tableColumnVo.setDataType(column.getTypeName());
        //     tableColumnVo.setComment(column.getComment());
        //     columns.add(tableColumnVo);
        // }
        // tableInfo.setColumns(columns);


        List<TableColumnVo> columns = baseMapper.getTableColumns(tableName);
        tableInfo.setColumns(columns);

        // 获取主键字段
        // String pkField = null;
        // for (TableColumnVo column : columns) {
        //     if ("PRI".equalsIgnoreCase(column.getKey())) {
        //         pkField = column.getField();
        //         break;
        //     }
        // }
        // tableInfo.setPkField(pkField);

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

        @Cleanup Connection conn = dataSource.getConnection();
        SqlExecutor.execute(conn, sql);
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
        @Cleanup Connection conn = dataSource.getConnection();
        SqlExecutor.execute(conn, sql);
    }

    public void deleteColumn(com.faber.api.flow.form.vo.req.DeleteColumnReqVo reqVo) throws SQLException {
        String tableName = reqVo.getTableName();
        String columnName = reqVo.getColumn();

        // 校验表名必须以ff_开头
        if (tableName == null || !tableName.startsWith("ff_")) {
            throw new IllegalArgumentException("表名必须以ff_开头");
        }

        String sql = String.format("ALTER TABLE `%s` DROP COLUMN `%s`;", tableName, columnName);

        @Cleanup Connection conn = dataSource.getConnection();
        SqlExecutor.execute(conn, sql);
    }

    public SaveFormDataReqVo saveFormData(SaveFormDataReqVo reqVo) throws SQLException {
        FlowForm flowForm = getById(reqVo.getFormId());
        if (flowForm == null) {
            throw new BuzzException("表单不存在，formId=" + reqVo.getFormId());
        }

        // 解析表单布局，获取子表配置
        Map<String, Object> configMap = flowForm.getConfig();
        FlowFormConfig flowFormConfig = JSONUtil.toBean(JSONUtil.toJsonStr(configMap), FlowFormConfig.class);

        // 拼接保存SQL
        FlowFormDataConfig dataConfig = flowForm.getDataConfig();

        // 保存主表数据
        @Cleanup Connection conn = dataSource.getConnection();
        Long mainTableId = save(conn, dataConfig.getMain(), reqVo.getFormData());

        // 保存子表数据
        List<FlowFormItem> subTableItems = flowFormConfig.getAllSubTableItems();
        for (FlowFormItem item : subTableItems) {
            String subTableName = item.getSubtable_tableName();
            List<Map<String, Object>> tableData = (List<Map<String, Object>>) reqVo.getFormData().get(item.getName());
            
            // 跳过空数据
            if (tableData == null || tableData.isEmpty()) {
                continue;
            }
            
            // 从数据库查找子表配置
            FlowFormTable flowFormTable = flowFormTableBiz.getLinkTable(flowForm.getId(), subTableName);
            
            if (flowFormTable == null) {
                throw new BuzzException("子表配置不存在: " + subTableName);
            }
            
            String fkField = flowFormTable.getForeignKey();
            FlowFormDataConfig.Table tableConfig = flowFormTable.getDataConfig();
            
            // 添加fkField字段
            for (Map<String, Object> rowData : tableData) {
                rowData.put(fkField, mainTableId);
            }

            // 生成批量insert SQL
            for (Map<String, Object> rowData : tableData) {
                save(conn, tableConfig, rowData);
            }
        }

        return reqVo;
    }

    /**
     * 保存单表数据
     * 
     * @param conn 数据库连接
     * @param tableConfig 表配置
     * @param data 要保存的数据
     * @param fkField 外键字段名（子表使用，主表传null）
     * @param fkValue 外键值（子表使用，主表传null）
     * @return 主键ID（主表）或null（子表）
     * @throws SQLException
     */
    private Long save(Connection conn, FlowFormDataConfig.Table tableConfig, Map<String, Object> data) throws SQLException {
        String userId = getCurrentUserId();
        String tableName = tableConfig.getTableName();
        
        StringBuilder sqlSb = new StringBuilder();
        StringBuilder fieldsSb = new StringBuilder();
        StringBuilder valuesSb = new StringBuilder();
        
        sqlSb.append("INSERT INTO `").append(tableName).append("` (");
        
        // 处理其他字段
        for (FlowFormDataConfig.Column column : tableConfig.getColumns()) {
            String field = column.getField();
            
            if (data.containsKey(field)) {
                fieldsSb.append("`").append(field).append("`, ");
                Object value = data.get(field);
                valuesSb.append("'").append(value).append("', ");
            } else if (field.equals("crt_time") || field.equals("upd_time")) {
                fieldsSb.append("`").append(field).append("`, ");
                valuesSb.append("CURRENT_TIMESTAMP, ");
            } else if (field.equals("crt_user") || field.equals("upd_user")) {
                fieldsSb.append("`").append(field).append("`, ");
                valuesSb.append("'").append(userId).append("', ");
            } else if (field.equals("deleted")) {
                fieldsSb.append("`").append(field).append("`, ");
                valuesSb.append("false, ");
            }
        }
        
        String sql = sqlSb.append(fieldsSb.substring(0, fieldsSb.length() - 2))
                .append(") VALUES (")
                .append(valuesSb.substring(0, valuesSb.length() - 2))
                .append(");")
                .toString();
        
        Long id = SqlExecutor.executeForGeneratedKey(conn, sql);
        data.put("id", id);
        return id;
    }

    /**
     * 自定义表单分页查询
     * @param query
     * @return
     */
    public TableRet<Map<String, Object>> pageFormData(QueryParams query) {
        if (query.getFlowFormId() == null) throw new BuzzException("FlowFormId is NULL.");
        FlowForm flowForm = this.getById(query.getFlowFormId());
        if (flowForm == null) throw new BuzzException("FlowForm Not Found." + query.getFlowFormId());
        if (StrUtil.isEmpty(flowForm.getTableName())) throw new BuzzException("FlowForm Not Set TableName." + query.getFlowFormId());

        StringBuilder sb = new StringBuilder();
        sb.append("SELECT * FROM ");
        sb.append(flowForm.getTableName());
        sb.append(" WHERE deleted = false ");

        // 解析where条件
        if (!query.getQuery().isEmpty()) {
            for (Map.Entry<String, Object> entry : query.getQuery().entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                if (value == null) continue;
                // TODO 支持更多查询操作符
                // key驼峰转下划线
                sb.append(" AND " + key + " LIKE '%" + value.toString() + "%' ");
            }
        }

        // 解析sorter
        if (StrUtil.isNotEmpty(query.getSorter())) {
            sb.append(" ORDER BY " + query.getSorter() + " ");
        }

        String sql = sb.toString();

        PageInfo<Map<String, Object>> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
            .doSelectPageInfo(() -> baseMapper.selectByDynamicSql(sql));
        return new TableRet<>(info);
    }

    public void removeFormDataById(Integer flowFormId, String id) throws SQLException {
        this.removeFormDataByIds(flowFormId, Arrays.asList(id));
    }

    public void removeFormDataByIds(Integer flowFormId, List<String> ids) throws SQLException {
        if (ids == null || ids.isEmpty()) {
            throw new BuzzException("ids is NULL.");
        }
        // 查询流程表单配置
        FlowForm flowForm = getById(flowFormId);
        if (flowForm == null) {
            throw new BuzzException("表单不存在，formId=" + flowFormId);
        }

        FlowFormDataConfig dataConfig = flowForm.getDataConfig();
        if (dataConfig == null || dataConfig.getMain() == null) {
            throw new BuzzException("表单数据配置不存在，formId=" + flowFormId);
        }

        String mainTableName = dataConfig.getMain().getTableName();
        if (StrUtil.isEmpty(mainTableName)) {
            throw new BuzzException("表单主表名称不存在，formId=" + flowFormId);
        }

        // 组装删除SQL（软删除）
        String sql = String.format(
            "UPDATE `%s` SET deleted = true, upd_time = CURRENT_TIMESTAMP, upd_user = '%s' WHERE id IN (%s) AND deleted = false",
            mainTableName,
            getCurrentUserId(),
            String.join(",", ids)
        );

        // 执行删除SQL
        @Cleanup Connection conn = dataSource.getConnection();
        int affectedRows = SqlExecutor.execute(conn, sql);
        
        if (affectedRows == 0) {
            throw new BuzzException("数据不存在或已被删除，id=" + ids);
        }

        // TODO 删除子表数据
    }

    public List<FaOption<String>> getFlowMenuList() {
        List<FlowForm> formList = lambdaQuery().orderByAsc(FlowForm::getSort).list();
        List<FaOption<String>> list = new ArrayList<>();
        for (FlowForm flowForm : formList) {
            FaOption<String> option = new FaOption<String>();
            option.setId("/admin/flow/view/form/" + flowForm.getId());
            option.setName(flowForm.getName());
            list.add(option);
        }
        return list;
    }

}