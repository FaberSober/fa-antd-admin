package com.faber.common.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;

@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class BaseUpdEntity extends BaseCrtEntity {

    @ExcelProperty("更新时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(fill = FieldFill.UPDATE)
    private LocalDateTime updTime;

    @ExcelIgnore
    @TableField(fill = FieldFill.UPDATE)
    private String updUser;

    @ExcelProperty("更新人")
    @TableField(fill = FieldFill.UPDATE)
    private String updName;

    @ExcelIgnore
    @TableField(fill = FieldFill.UPDATE)
    private String updHost;

}
