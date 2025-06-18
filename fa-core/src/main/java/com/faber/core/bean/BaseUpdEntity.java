package com.faber.core.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.faber.core.annotation.FaPropIgnore;
import com.faber.core.annotation.SqlEquals;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class BaseUpdEntity extends BaseCrtEntity {

    @FaPropIgnore
    @ColumnWidth(20)
    @ExcelProperty("更新时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(fill = FieldFill.UPDATE)
    private LocalDateTime updTime;

    @FaPropIgnore
    @SqlEquals
    @ExcelIgnore
    @TableField(fill = FieldFill.UPDATE)
    private String updUser;

    @FaPropIgnore
    @ExcelProperty("更新人")
    @TableField(fill = FieldFill.UPDATE)
    private String updName;

    @FaPropIgnore
    @ExcelIgnore
    @TableField(fill = FieldFill.UPDATE)
    private String updHost;

}
