package com.faber.rbac.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.*;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.enums.BoolEnum;
import com.faber.common.enums.RbacLinkTypeEnum;
import com.faber.common.enums.RbacMenuLevelEnum;
import lombok.Data;


/**
 * BASE-权限表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaberModalName(name = "BASE-权限表")
@TableName("base_rbac_menu")
@Data
public class RbacMenu extends BaseDelEntity {

    @SqlTreeId
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @SqlTreeParentId
    @ExcelProperty("父级ID")
    private Long parentId;

    @SqlTreeName
    @ExcelProperty("名称")
    private String name;

    @SqlSorter
    @ExcelProperty("排序")
    private Integer sort;

    @ExcelProperty("菜单等级：0-模块/1-一级菜单/2-二级菜单/3-三级菜单/9-按钮")
    private RbacMenuLevelEnum level;

    @ExcelProperty("图标标识")
    private String icon;

    @ExcelProperty("是否启用0-禁用/1-启用")
    private BoolEnum status;

    @ExcelProperty("链接类型【1-内部链接(默认)2-外部链接】")
    private RbacLinkTypeEnum linkType;

    @ExcelProperty("链接地址【pathinfo#method】")
    private String linkUrl;

}
