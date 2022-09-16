package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.bean.BaseUpdEntity;
import lombok.Data;

import javax.persistence.*;

/**
 * 角色组用户
 */
@Data
@Table(name = "base_group_user")
public class GroupUser extends BaseUpdEntity {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ExcelProperty("分组ID")
    @Column(name = "group_id")
    private Integer groupId;

    @ExcelProperty("用户ID")
    @Column(name = "user_id")
    private String userId;

    @ExcelProperty("描述")
    @Column(name = "description")
    private String description;

    @ExcelProperty("类型")
    @Column(name = "type")
    private String type;

}
