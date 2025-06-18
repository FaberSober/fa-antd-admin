package com.faber.core.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.faber.core.annotation.FaCol;
import com.faber.core.annotation.FaPropIgnore;
import com.faber.core.annotation.SqlEquals;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class BaseCrtEntity implements Serializable {

    @FaPropIgnore
    @ExcelProperty("创建时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime crtTime;

    @SqlEquals
    @FaPropIgnore
    @ExcelIgnore
    @TableField(fill = FieldFill.INSERT)
    private String crtUser;

    @FaPropIgnore
    @ExcelProperty("创建人")
    @TableField(fill = FieldFill.INSERT)
    private String crtName;

    @FaPropIgnore
    @ExcelIgnore
    @TableField(fill = FieldFill.INSERT)
    private String crtHost;

}
