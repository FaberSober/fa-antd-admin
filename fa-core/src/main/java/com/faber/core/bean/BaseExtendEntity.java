package com.faber.core.bean;

import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.core.annotation.SqlEquals;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public abstract class BaseExtendEntity extends BaseDelEntity {

    @ExcelProperty("排序")
    private Integer sort;

    @SqlEquals
    @ExcelProperty("是否有效")
    private Boolean valid;

}
