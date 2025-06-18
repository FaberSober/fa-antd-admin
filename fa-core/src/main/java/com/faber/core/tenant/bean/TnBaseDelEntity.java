package com.faber.core.tenant.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.faber.core.annotation.SqlEquals;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

/**
 * @author Farando
 * @date 2023/3/6 17:04
 * @description
 */
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class TnBaseDelEntity extends TnBaseUpdEntity {

    @SqlEquals
    @ExcelIgnore
    @TableLogic(value = "false", delval = "true")
    @TableField(select = false)
    private Boolean deleted;

}
