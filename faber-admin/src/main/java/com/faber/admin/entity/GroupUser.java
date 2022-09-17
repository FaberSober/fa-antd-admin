package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.bean.BaseUpdEntity;
import lombok.Data;

/**
 * 角色组用户
 */
@Data
@TableName("base_group_user")
public class GroupUser extends BaseUpdEntity {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("分组ID")
    // @Column(name = "group_id")
    private Integer groupId;

    @ExcelProperty("用户ID")
    // @Column(name = "user_id")
    private String userId;

    @ExcelProperty("描述")
    // @Column(name = "description")
    private String description;

    @ExcelProperty("类型")
    // @Column(name = "type")
    private String type;

}
