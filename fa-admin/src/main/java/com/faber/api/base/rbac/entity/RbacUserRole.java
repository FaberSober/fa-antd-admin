package com.faber.api.base.rbac.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;


/**
 * BASE-用户角色关联表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaModalName(name = "BASE-用户角色关联表")
@TableName("base_rbac_user_role")
@Data
public class RbacUserRole extends BaseDelEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @ExcelProperty("用户ID")
    private String userId;

    @ExcelProperty("角色ID")
    private Long roleId;

}
