package com.faber.rbac.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;
import lombok.experimental.Accessors;

import java.util.Date;


/**
 * BASE-用户角色关联表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaberModalName(name = "BASE-用户角色关联表")
@TableName("base_rbac_user_role")
@Data
@Accessors(chain = true)
public class RbacUserRole extends BaseDelEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("用户ID")
    private String userId;

    @ExcelProperty("角色ID")
    private Integer roleId;

    @ExcelProperty("创建时间")
    private Date crtTime;

}
