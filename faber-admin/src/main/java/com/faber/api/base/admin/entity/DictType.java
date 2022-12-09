package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;


/**
 * 字典分类
 */
@TableName("base_dict_type")
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public class DictType extends BaseDelEntity {

    @TableId(type = IdType.AUTO)
    @SqlTreeId
    private Integer id;

    @ExcelProperty("编码")
    private String code;

    @ExcelProperty("名称")
    @SqlTreeName
    private String name;

    @SqlEquals
    @ExcelProperty("上级节点")
    @SqlTreeParentId
    private Integer parentId;

    @SqlSorter
    @ExcelProperty("排序ID")
    private Integer sortId;

    @ExcelProperty("描述")
    private String description;

}
