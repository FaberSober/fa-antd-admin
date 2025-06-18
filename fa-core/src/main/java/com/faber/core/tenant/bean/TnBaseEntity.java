package com.faber.core.tenant.bean;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.faber.core.annotation.SqlEquals;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.io.Serializable;

/**
 * @author Farando
 * @date 2023/3/6 17:02
 * @description
 */
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class TnBaseEntity implements Serializable {

    @SqlEquals
    @ExcelProperty("企业ID")
    @TableField(fill = FieldFill.INSERT)
    private Long corpId;

    @SqlEquals
    @ExcelProperty("租户ID")
    @TableField(fill = FieldFill.INSERT)
    private Long tenantId;

}
