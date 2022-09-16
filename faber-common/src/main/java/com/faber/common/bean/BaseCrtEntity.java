package com.faber.common.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class BaseCrtEntity implements Serializable {

    @ExcelProperty("创建时间")
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime crtTime;

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
