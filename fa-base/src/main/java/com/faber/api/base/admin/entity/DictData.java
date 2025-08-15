package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

import java.util.Date;
import java.math.BigDecimal;

/**
 * BASE-字典值
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-07-08 17:22:52
 */
@FaModalName(name = "BASE-字典值")
@TableName("base_dict_data")
@Data
public class DictData extends BaseDelEntity {

    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    @SqlTreeId
    private Integer id;

    @SqlTreeParentId
    @ExcelProperty("上级节点")
    private Integer parentId;

    @SqlEquals
    @ExcelProperty("字典分类ID")
    private Integer dictId;

    @TableField(exist = false)
    @ExcelProperty("字典分类")
    private String dictName;

    @SqlSorter
    @ExcelProperty("排序ID")
    private Integer sortId;

    @SqlSearch
    @SqlTreeName
    @ExcelProperty("字典键")
    private String label;

    @SqlSearch
    @ExcelProperty("字典值")
    private String value;

    @ExcelProperty("是否默认值：0否 1是")
    private Boolean isDefault;

    @ExcelProperty("是否生效：0否 1是")
    private Boolean valid;

    @SqlSearch
    @ExcelProperty("描述")
    private String description;

}
