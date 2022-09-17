package com.faber.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.*;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.constant.CommonConstants;
import lombok.Data;

import com.baomidou.mybatisplus.annotation.TableName;

/**
 * 角色组
 */
@FaberModalName(name = "角色组")
@Data
@TableName("base_group")
public class Group extends BaseDelEntity {

    @TableId(type = IdType.AUTO)
    @SqlTreeId
    private Integer id;

    @ExcelProperty("角色编码")
    // @Column(name = "code")
    private String code;

    @SqlTreeName
    @ExcelProperty("角色名称")
    // @Column(name = "name")
    private String name;

    @SqlEquals
    @ExcelProperty("上级节点")
    // @Column(name = "parent_id")
    @SqlTreeParentId
    private Integer parentId;

    @SqlSorter
    @ExcelProperty("排序ID")
    // @Column(name = "sort")
    private Integer sort;

    @ExcelProperty("树状关系")
    // @Column(name = "path")
    private String path;

    @Deprecated
    @ExcelProperty("类型")
    // @Column(name = "type")
    private String type;

    @SqlEquals
    @ExcelProperty("角色组类型")
    // @Column(name = "group_type")
    private Integer groupType = CommonConstants.DEFAULT_GROUP_TYPE;

    @ExcelProperty("描述")
    // @Column(name = "description")
    private String description;

}
