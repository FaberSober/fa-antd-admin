package com.faber.api.base.rbac.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.api.base.rbac.enums.RbacMenuScopeEnum;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import com.faber.api.base.rbac.enums.RbacLinkTypeEnum;
import com.faber.api.base.rbac.enums.RbacMenuLevelEnum;
import com.faber.core.config.validator.validator.Vg;
import lombok.Data;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;


/**
 * BASE-权限表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaModalName(name = "BASE-权限表")
@TableName("base_rbac_menu")
@Data
public class RbacMenu extends BaseDelEntity {

    @Null(groups = Vg.Crud.C.class)
    @NotNull(groups = Vg.Crud.U.class)
    @SqlTreeId
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @NotNull
    @SqlTreeParentId
    @SqlEquals
    @ExcelProperty("父级ID")
    private Long parentId;

    @NotNull
    @SqlTreeName
    @ExcelProperty("名称")
    private String name;

    @SqlSorter
    @ExcelProperty("排序")
    private Integer sort;

    @ExcelProperty("模块：1-web/2-app")
    private RbacMenuScopeEnum scope;

    @NotNull
    @ExcelProperty("菜单等级：0-模块/1-菜单/9-按钮")
    private RbacMenuLevelEnum level;

    @ExcelProperty("图标标识")
    private String icon;

    @ExcelProperty("是否启用0-禁用/1-启用")
    private Boolean status;

    @ExcelProperty("链接类型【1-内部链接(默认)2-外部链接】")
    private RbacLinkTypeEnum linkType;

    @ExcelProperty("链接地址【pathinfo#method】")
    private String linkUrl;

}
