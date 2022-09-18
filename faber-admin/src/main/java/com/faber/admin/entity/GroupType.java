package com.faber.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@TableName("base_group_type")
public class GroupType extends BaseDelEntity {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("编码")
    // @Column(name = "code")
    private String code;

    @ExcelProperty("类型名称")
    // @Column(name = "name")
    private String name;

    @ExcelProperty("描述")
    // @Column(name = "description")
    private String description;

}
