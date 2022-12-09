package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;


/**
 * Base-部门
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-07 19:26:53
 */
@TableName("base_department")
@Data
public class Department extends BaseDelEntity {
    private static final long serialVersionUID = 1L;

    @TableId(type = IdType.ASSIGN_UUID)
    @SqlTreeId
    private String id;

    /** 父部门ID */
    @SqlEquals
    @SqlTreeParentId
    private String parentId;

    /** 部门名称 */
    @SqlTreeName
    private String name;

    /** 描述 */
    private String description;

    /** 排序 */
    @SqlSorter
    private Integer sort;

    /** 类型 */
    @SqlEquals
    private String type;

    @SqlEquals
    @ExcelProperty("负责人ID")
    private String managerId;

}
