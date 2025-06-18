package com.faber.core.tenant.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.faber.core.annotation.SqlEquals;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;

/**
 * @author Farando
 * @date 2023/3/6 17:02
 * @description
 */
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class TnBaseCrtEntity extends TnBaseEntity {

    @ExcelProperty("创建时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime crtTime;

    @SqlEquals
    @ExcelIgnore
    @TableField(fill = FieldFill.INSERT)
    private String crtUser;

    @ExcelProperty("创建人")
    @TableField(fill = FieldFill.INSERT)
    private String crtName;

    @ExcelIgnore
    @TableField(fill = FieldFill.INSERT)
    private String crtHost;

}
