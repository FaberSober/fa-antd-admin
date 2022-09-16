package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.bean.BaseUpdEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;

@Data
@EqualsAndHashCode(callSuper = true)
@Table(name = "base_group_type")
public class GroupType extends BaseUpdEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ExcelProperty("编码")
    @Column(name = "code")
    private String code;

    @ExcelProperty("类型名称")
    @Column(name = "name")
    private String name;

    @ExcelProperty("描述")
    @Column(name = "description")
    private String description;

}
