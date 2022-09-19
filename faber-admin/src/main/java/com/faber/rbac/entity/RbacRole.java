package com.faber.rbac.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.FaberModalName;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.Date;
import java.math.BigDecimal;


/**
 * BASE-角色表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-19 11:40:40
 */
@FaberModalName(name = "BASE-角色表")
@TableName(name = "base_rbac_role")
@Data
@Accessors(chain = true)
public class RbacRole implements Serializable {
	private static final long serialVersionUID = 1L;
	
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("角色名称")
    private String name;

    @ExcelProperty("角色描述")
    private String remarks;

    @ExcelProperty("是否启用")
    private Integer status;

    @ExcelProperty("创建时间")
    private Date crtTime;

    @ExcelProperty("创建用户ID")
    private String crtUser;

    @ExcelProperty("创建用户")
    private String crtName;

    @ExcelProperty("创建IP")
    private String crtHost;

    @ExcelProperty("更新时间")
    private Date updTime;

    @ExcelProperty("更新用户ID")
    private String updUser;

    @ExcelProperty("更新用户")
    private String updName;

    @ExcelProperty("更新IP")
    private String updHost;

    @ExcelProperty("删除状态0-正常/1-删除")
    private Integer delState;

}
