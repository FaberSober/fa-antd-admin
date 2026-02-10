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
import com.faber.api.flow.manage.biz.FlowCatagoryBiz;
import com.faber.api.flow.manage.entity.FlowCatagory;
import com.faber.core.exception.BuzzException;
import com.faber.core.service.FaFlowService;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.QueryParams;
import com.faber.core.vo.utils.FaOption;
import com.faber.core.web.biz.BaseBiz;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import cn.hutool.core.util.StrUtil;
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
    @Resource FlowCatagoryBiz flowCatagoryBiz;

    private static final List<String> DATA_TYPES_LENGTH = List.of("varchar", "int", "bigint");
    private static final List<String> DATA_TYPES_PRECISION = List.of("decimal", "numeric");

    @Override
    public void decorateOne(FlowForm i) {
        FlowCatagory flowCatagory = flowCatagoryBiz.getByIdWithCache(i.getCatagoryId());
        if (flowCatagory != null) {
            i.setCatagoryName(flowCatagory.getName());
        }
    }

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
                "  `flow_instance_id` bigint(20) DEFAULT NULL COMMENT '流程实例ID',\n" +
                "  `tenant_id` bigint(20) DEFAULT NULL COMMENT '租户ID',\n" +
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
        
        // 尝试从Hutool获取表注释
        String tableComment = tableMeta.getComment();
        // 如果Hutool获取不到，使用SQL查询获取
        if (tableComment == null || tableComment.isEmpty()) {
            tableComment = baseMapper.getTableComment(tableName);
        }
        tableInfo.setTableComment(tableComment);
        
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
        saveFormData(reqVo.getFormId(), reqVo.getFormData());
        return reqVo;
    }

    public SaveFormDataReqVo updateFormData(SaveFormDataReqVo reqVo) throws SQLException {
        updateFormData(reqVo.getFormId(), reqVo.getFormData());
        return reqVo;
    }

    public Map<String, Object> updateFormData(Integer formId, Map<String, Object> formData) throws SQLException {
        FlowForm flowForm = getById(formId);
        if (flowForm == null) {
            throw new BuzzException("表单不存在,formId=" + formId);
        }

        // 检查是否有 id 字段
        if (!formData.containsKey("id")) {
            throw new BuzzException("更新数据必须包含 id 字段");
        }

        // 解析表单布局,获取子表配置
        Map<String, Object> configMap = flowForm.getConfig();
        FlowFormConfig flowFormConfig = JSONUtil.toBean(JSONUtil.toJsonStr(configMap), FlowFormConfig.class);

        // 获取数据配置
        FlowFormDataConfig dataConfig = flowForm.getDataConfig();

        // 更新主表数据
        @Cleanup Connection conn = dataSource.getConnection();
        Long mainTableId = update(conn, dataConfig.getMain(), formData);

        // 更新子表数据
        List<FlowFormItem> subTableItems = flowFormConfig.getAllSubTableItems();
        for (FlowFormItem item : subTableItems) {
            String subTableName = item.getSubtable_tableName();
            List<Map<String, Object>> tableData = (List<Map<String, Object>>) formData.get(item.getName());
            
            // 从数据库查找子表配置
            FlowFormTable flowFormTable = flowFormTableBiz.getLinkTable(flowForm.getId(), subTableName);
            
            if (flowFormTable == null) {
                throw new BuzzException("子表配置不存在: " + subTableName);
            }
            
            String fkField = flowFormTable.getForeignKey();
            FlowFormDataConfig.Table tableConfig = flowFormTable.getDataConfig();
            
            // 跳过空数据
            if (tableData == null || tableData.isEmpty()) {
                // 删除所有子表数据（没有传数据表示清空）
                String deleteSql = String.format(
                    "UPDATE `%s` SET deleted = true, upd_time = CURRENT_TIMESTAMP, upd_user = '%s' WHERE %s = %d AND deleted = false",
                    tableConfig.getTableName(),
                    getCurrentUserId(),
                    fkField,
                    mainTableId
                );
                SqlExecutor.execute(conn, deleteSql);
                continue;
            }

            // 收集所有有id的数据和没有id的数据
            List<Long> updateIds = new ArrayList<>();
            List<Map<String, Object>> insertDataList = new ArrayList<>();
            List<Map<String, Object>> updateDataList = new ArrayList<>();
            
            for (Map<String, Object> rowData : tableData) {
                // 清理前端临时字段（以_开头的字段）
                rowData.entrySet().removeIf(entry -> entry.getKey().startsWith("_"));
                
                Object idObj = rowData.get("id");
                if (idObj != null) {
                    // 有id，需要更新
                    Long id = Long.parseLong(idObj.toString());
                    updateIds.add(id);
                    updateDataList.add(rowData);
                } else {
                    // 没有id，需要插入
                    insertDataList.add(rowData);
                }
            }
            
            // 1. 删除不在更新列表中的数据
            String deleteSql;
            if (!updateIds.isEmpty()) {
                String idsStr = updateIds.stream().map(String::valueOf).reduce((a, b) -> a + "," + b).orElse("");
                deleteSql = String.format(
                    "UPDATE `%s` SET deleted = true, upd_time = CURRENT_TIMESTAMP, upd_user = '%s' WHERE %s = %d AND id NOT IN (%s) AND deleted = false",
                    tableConfig.getTableName(),
                    getCurrentUserId(),
                    fkField,
                    mainTableId,
                    idsStr
                );
            } else {
                // 没有要更新的数据，删除所有旧数据
                deleteSql = String.format(
                    "UPDATE `%s` SET deleted = true, upd_time = CURRENT_TIMESTAMP, upd_user = '%s' WHERE %s = %d AND deleted = false",
                    tableConfig.getTableName(),
                    getCurrentUserId(),
                    fkField,
                    mainTableId
                );
            }
            SqlExecutor.execute(conn, deleteSql);
            
            // 2. 更新已有数据
            for (Map<String, Object> rowData : updateDataList) {
                update(conn, tableConfig, rowData);
            }
            
            // 3. 插入新数据
            for (Map<String, Object> rowData : insertDataList) {
                rowData.put(fkField, mainTableId);
                save(conn, tableConfig, rowData);
            }
        }

        return formData;
    }

    public Map<String, Object> saveFormData(Integer formId, Map<String, Object> formData) throws SQLException {
        FlowForm flowForm = getById(formId);
        if (flowForm == null) {
            throw new BuzzException("表单不存在，formId=" + formId);
        }

        // 解析表单布局，获取子表配置
        Map<String, Object> configMap = flowForm.getConfig();
        FlowFormConfig flowFormConfig = JSONUtil.toBean(JSONUtil.toJsonStr(configMap), FlowFormConfig.class);

        // 拼接保存SQL
        FlowFormDataConfig dataConfig = flowForm.getDataConfig();

        // 保存主表数据
        @Cleanup Connection conn = dataSource.getConnection();
        Long mainTableId = save(conn, dataConfig.getMain(), formData);

        // 保存子表数据
        List<FlowFormItem> subTableItems = flowFormConfig.getAllSubTableItems();
        for (FlowFormItem item : subTableItems) {
            String subTableName = item.getSubtable_tableName();
            List<Map<String, Object>> tableData = (List<Map<String, Object>>) formData.get(item.getName());
            
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
                // 清理前端临时字段（以_开头的字段）
                rowData.entrySet().removeIf(entry -> entry.getKey().startsWith("_"));
                
                rowData.put(fkField, mainTableId);
                save(conn, tableConfig, rowData);
            }
        }

        return formData;
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
                Object value = data.get(field);
                // 跳过系统字段，这些字段由系统控制
                if (field.equals("id") || field.equals("deleted") || 
                    field.equals("crt_time") || field.equals("crt_user") || 
                    field.equals("upd_time") || field.equals("upd_user")) {
                    continue;
                }
                // 跳过null值的字段，不插入到SQL中
                if (value != null) {
                    fieldsSb.append("`").append(field).append("`, ");
                    valuesSb.append("'").append(value).append("', ");
                }
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
     * 更新单表数据
     * 
     * @param conn 数据库连接
     * @param tableConfig 表配置
     * @param data 要更新的数据(必须包含id字段)
     * @return 主键ID
     * @throws SQLException
     */
    private Long update(Connection conn, FlowFormDataConfig.Table tableConfig, Map<String, Object> data) throws SQLException {
        String userId = getCurrentUserId();
        String tableName = tableConfig.getTableName();
        
        // 获取ID
        Object idObj = data.get("id");
        if (idObj == null) {
            throw new BuzzException("更新数据必须包含 id 字段");
        }
        Long id = Long.parseLong(idObj.toString());
        
        StringBuilder sqlSb = new StringBuilder();
        StringBuilder setSb = new StringBuilder();
        
        sqlSb.append("UPDATE `").append(tableName).append("` SET ");
        
        // 处理其他字段
        for (FlowFormDataConfig.Column column : tableConfig.getColumns()) {
            String field = column.getField();
            
            // 跳过id字段和系统字段
            if (field.equals("id") || field.equals("crt_time") || field.equals("crt_user") || field.equals("deleted")) {
                continue;
            }
            
            if (data.containsKey(field)) {
                Object value = data.get(field);
                // 只更新非null值的字段
                if (value != null) {
                    setSb.append("`").append(field).append("` = '").append(value).append("', ");
                }
            } else if (field.equals("upd_time")) {
                setSb.append("`").append(field).append("` = CURRENT_TIMESTAMP, ");
            } else if (field.equals("upd_user")) {
                setSb.append("`").append(field).append("` = '").append(userId).append("', ");
            }
        }
        
        // 确保至少更新 upd_time 和 upd_user
        if (setSb.length() == 0) {
            setSb.append("`upd_time` = CURRENT_TIMESTAMP, `upd_user` = '").append(userId).append("', ");
        }
        
        String sql = sqlSb.append(setSb.substring(0, setSb.length() - 2))
                .append(" WHERE `id` = ").append(id)
                .append(" AND `deleted` = false;")
                .toString();
        
        int affectedRows = SqlExecutor.execute(conn, sql);
        
        if (affectedRows == 0) {
            throw new BuzzException("数据不存在或已被删除,id=" + id);
        }
        
        return id;
    }

    /**
     * 更新业务数据的流程ID
     * @param formId
     * @param formDataId
     * @param flowInstanceId
     */
    public void updateDataFlowInstanceId(Integer formId, Long formDataId, Long flowInstanceId) {
        try {
            // 获取formId的配置
            FlowForm flowForm = getById(formId);
            if (flowForm == null) {
                throw new BuzzException("表单不存在，formId=" + formId);
            }

            // 获取主表配置
            FlowFormDataConfig dataConfig = flowForm.getDataConfig();
            if (dataConfig == null || dataConfig.getMain() == null) {
                throw new BuzzException("表单数据配置不存在，formId=" + formId);
            }

            FlowFormDataConfig.Table mainTable = dataConfig.getMain();
            String tableName = mainTable.getTableName();
            if (StrUtil.isEmpty(tableName)) {
                throw new BuzzException("表单主表名称不存在，formId=" + formId);
            }

            // 判断主表是否有flow_instance_id字段
            TableInfoVo tableInfo = queryTableStructure(tableName);
            if (tableInfo.getExist() == null || !tableInfo.getExist()) {
                throw new BuzzException("表不存在，tableName=" + tableName);
            }

            // 检查是否有flow_instance_id字段
            boolean hasFlowInstanceIdField = tableInfo.getColumns().stream()
                    .anyMatch(column -> "flow_instance_id".equals(column.getField()));

            // 如果有，更新为flowInstanceId
            if (hasFlowInstanceIdField) {
                String sql = String.format(
                        "UPDATE `%s` SET flow_instance_id = %d, upd_time = CURRENT_TIMESTAMP, upd_user = '%s' WHERE id = %d AND deleted = false",
                        tableName,
                        flowInstanceId,
                        getCurrentUserId(),
                        formDataId
                );

                @Cleanup Connection conn = dataSource.getConnection();
                int affectedRows = SqlExecutor.execute(conn, sql);
                
                if (affectedRows == 0) {
                    throw new BuzzException("数据不存在或已被删除，id=" + formDataId);
                }
            }
            // 如果没有flow_process_id字段，不更新，不抛出异常
        } catch (SQLException e) {
            throw new BuzzException("更新业务数据流程ID失败: " + e.getMessage());
        }
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

        // 判断是否有flow_instance_id字段，如果有，sql增加和flw_his_instance的关联查询
        String tableName = flowForm.getTableName();
        boolean hasFlowInstanceIdField = false;
        if (flowForm.getFlowProcessId() != null) {
            hasFlowInstanceIdField = hasFlowInstanceIdField(tableName);
        }

        StringBuilder sb = new StringBuilder();
        
        // 有flow_instance_id字段，使用关联查询
        sb.append("SELECT t.* ");

        if (hasFlowInstanceIdField) {
            sb.append(", fhi.current_node_name, fhi.current_node_key, fhi.instance_state ");
        }

        sb.append("FROM " + tableName + " t ");

        if (hasFlowInstanceIdField) {
            sb.append("LEFT JOIN flw_his_instance fhi ON t.flow_instance_id = fhi.id ");
        }
        
        sb.append("WHERE t.deleted = false ");
        
        // 解析where条件（需要加t.前缀）
        if (!query.getQuery().isEmpty()) {
            for (Map.Entry<String, Object> entry : query.getQuery().entrySet()) {
                String key = entry.getKey();
                Object value = entry.getValue();
                if (value == null) continue;
                // TODO 支持更多查询操作符
                // key驼峰转下划线
                sb.append(" AND t." + key + " LIKE '%" + value.toString() + "%' ");
            }
        }
        
        // 解析sorter（需要加t.前缀）
        if (StrUtil.isNotEmpty(query.getSorter())) {
            sb.append(" ORDER BY t." + query.getSorter() + " ");
        }

        String sql = sb.toString();

        PageInfo<Map<String, Object>> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
            .doSelectPageInfo(() -> baseMapper.selectByDynamicSql(sql));
        return new TableRet<>(info);
    }

    /**
     * 根据ID查询表单数据详情
     * @param flowFormId 表单ID
     * @param id 数据ID
     * @return 表单数据详情（包含主表数据和子表数据）
     * @throws SQLException
     */
    public Map<String, Object> getFormDataDetailById(Integer flowFormId, String id) throws SQLException {
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

        // 查询主表数据
        String sql = String.format(
            "SELECT * FROM `%s` WHERE id = %s AND deleted = false",
            mainTableName,
            id
        );

        @Cleanup Connection conn = dataSource.getConnection();
        List<Map<String, Object>> list = SqlExecutor.query(conn, sql, rs -> {
            List<Map<String, Object>> result = new ArrayList<>();
            try {
                int columnCount = rs.getMetaData().getColumnCount();
                while (rs.next()) {
                    Map<String, Object> row = new java.util.HashMap<>();
                    for (int i = 1; i <= columnCount; i++) {
                        String columnName = rs.getMetaData().getColumnName(i);
                        Object value = rs.getObject(i);
                        row.put(columnName, value);
                    }
                    result.add(row);
                }
            } catch (SQLException e) {
                throw new RuntimeException(e);
            }
            return result;
        });

        if (list == null || list.isEmpty()) {
            throw new BuzzException("数据不存在，id=" + id);
        }

        Map<String, Object> mainData = list.get(0);

        // 解析表单布局，获取子表配置
        Map<String, Object> configMap = flowForm.getConfig();
        FlowFormConfig flowFormConfig = JSONUtil.toBean(JSONUtil.toJsonStr(configMap), FlowFormConfig.class);

        // 查询子表数据
        List<FlowFormItem> subTableItems = flowFormConfig.getAllSubTableItems();
        for (FlowFormItem item : subTableItems) {
            String subTableName = item.getSubtable_tableName();
            
            // 从数据库查找子表配置
            FlowFormTable flowFormTable = flowFormTableBiz.getLinkTable(flowForm.getId(), subTableName);
            
            if (flowFormTable == null) {
                throw new BuzzException("子表配置不存在: " + subTableName);
            }
            
            String fkField = flowFormTable.getForeignKey();
            FlowFormDataConfig.Table tableConfig = flowFormTable.getDataConfig();
            
            // 查询子表数据
            String subSql = String.format(
                "SELECT * FROM `%s` WHERE %s = %s AND deleted = false",
                tableConfig.getTableName(),
                fkField,
                id
            );
            
            List<Map<String, Object>> subList = SqlExecutor.query(conn, subSql, rs -> {
                List<Map<String, Object>> result = new ArrayList<>();
                try {
                    int columnCount = rs.getMetaData().getColumnCount();
                    while (rs.next()) {
                        Map<String, Object> row = new java.util.HashMap<>();
                        for (int i = 1; i <= columnCount; i++) {
                            String columnName = rs.getMetaData().getColumnName(i);
                            Object value = rs.getObject(i);
                            row.put(columnName, value);
                        }
                        result.add(row);
                    }
                } catch (SQLException e) {
                    throw new RuntimeException(e);
                }
                return result;
            });
            
            // 将子表数据添加到主数据中
            mainData.put(item.getName(), subList);
        }

        return mainData;
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

    /**
     * 判断表是否有flow_instance_id字段
     * @param tableName 表名
     * @return 是否有flow_instance_id字段
     */
    private boolean hasFlowInstanceIdField(String tableName) {
        try {
            TableInfoVo tableInfo = queryTableStructure(tableName);
            if (tableInfo.getExist() != null && tableInfo.getExist()) {
                return tableInfo.getColumns().stream()
                        .anyMatch(column -> "flow_instance_id".equals(column.getField()));
            }
        } catch (SQLException e) {
            // 查询表结构失败，返回false
        }
        return false;
    }

}