package com.faber.core.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.faber.core.enums.DelStateEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class BaseDelEntity extends BaseUpdEntity {

    @ExcelIgnore
    @TableLogic(value = "false", delval = "true")
    @TableField(select = false)
    private Boolean delState;

}
