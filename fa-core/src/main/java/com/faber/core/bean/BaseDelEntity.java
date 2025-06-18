package com.faber.core.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.faber.core.annotation.FaPropIgnore;
import com.faber.core.annotation.SqlEquals;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class BaseDelEntity extends BaseUpdEntity {

    @FaPropIgnore
    @SqlEquals
    @ExcelIgnore
    @TableLogic(value = "false", delval = "true")
    @TableField(select = false, fill = FieldFill.INSERT)
    private Boolean deleted;

}
