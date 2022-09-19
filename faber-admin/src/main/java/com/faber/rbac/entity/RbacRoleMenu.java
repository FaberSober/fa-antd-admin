package com.faber.rbac.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;
import lombok.experimental.Accessors;


/**
 * BASE-角色权限对应表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaberModalName(name = "BASE-角色权限对应表")
@TableName("base_rbac_role_menu")
@Data
@Accessors(chain = true)
public class RbacRoleMenu extends BaseDelEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("角色ID")
    private Integer roleId;

    @ExcelProperty("权限ID")
    private Integer menuId;

}
