package com.faber.api.flow.form.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.config.mybatis.handler.UniversalJsonTypeHandler;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * FLOW-流程表单关联表
 *
 * @author Code Generator
 * @date 2026-01-31
 */
@Data
@EqualsAndHashCode(callSuper = true)
@FaModalName(name = "流程表单关联表")
@TableName(value = "flow_form_table", autoResultMap = true)
public class FlowFormTable extends BaseDelEntity {

    @ColumnWidth(10)
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
    @ExcelProperty("流程表单ID")
    private Integer flowFormId;

    @ExcelProperty("排序ID")
    private Integer sort;

    @ExcelProperty("表名")
    private String tableName;

    @ExcelProperty("数据库配置")
    @TableField(typeHandler = UniversalJsonTypeHandler.class)
    private Object dataConfig;

    @ExcelProperty("备注")
    private String remark;

    @ExcelProperty("外键字段")
    private String foreignKey;

    @ExcelProperty("关联主键")
    private String referenceKey;

}
