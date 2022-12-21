package com.faber.api.base.rbac.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * BASE-角色权限对应表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaModalName(name = "BASE-角色权限对应表")
@TableName("base_rbac_role_menu")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RbacRoleMenu extends BaseDelEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @ExcelProperty("角色ID")
    private Long roleId;

    @ExcelProperty("权限ID")
    private Long menuId;

    @ExcelProperty("是否半勾选")
    private Boolean halfChecked;

}
