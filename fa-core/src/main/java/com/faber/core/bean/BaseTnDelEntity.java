package com.faber.core.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.faber.core.annotation.FaPropIgnore;
import com.faber.core.annotation.SqlEquals;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * 带租户ID的通用逻辑删除实体基类
 */
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class BaseTnDelEntity extends BaseDelEntity {

    @FaPropIgnore
    @SqlEquals
    @ExcelIgnore
    @ExcelProperty("租户ID")
    @TableField(fill = FieldFill.INSERT)
    private String tenantId;

}
