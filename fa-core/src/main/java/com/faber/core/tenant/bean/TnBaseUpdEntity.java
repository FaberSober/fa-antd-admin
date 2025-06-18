package com.faber.core.tenant.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseUpdEntity;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDateTime;

/**
 * @author Farando
 * @date 2023/3/6 17:03
 * @description
 */
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class TnBaseUpdEntity extends TnBaseCrtEntity {

    @ExcelProperty("更新时间")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(fill = FieldFill.UPDATE)
    private LocalDateTime updTime;

    @SqlEquals
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
