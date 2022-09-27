package com.faber.common.bean;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.faber.common.enums.DelStateEnum;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class BaseDelEntity extends BaseUpdEntity {

    @ExcelIgnore
    @TableLogic(value = "0", delval = "1")
    @TableField(select = false)
    private DelStateEnum delState;

    public void removeLogic() {
        this.delState = DelStateEnum.DELETED;
    }

}
