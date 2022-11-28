package com.faber.buzz.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.common.annotation.*;
import com.faber.common.bean.BaseDelEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;
import org.apache.commons.lang3.StringUtils;


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

    // 父部门ID
    @SqlEquals
    @SqlTreeParentId
    private String parentId;

    // 部门名称
    @SqlTreeName
    private String name;

    // 描述
    private String description;

    // 排序
    @SqlSorter
    private Integer sort;

    // 类型
    @SqlEquals
    private String type;

    @SqlEquals
    @ExcelProperty("负责人ID")
    private String managerId;

    @ToString
    @AllArgsConstructor
    public enum Type {
        CORP("CORP", "公司"),
        DEPT("DEPT", "部门"),
        TEAM("TEAM", "班组");

        public final String value;
        public final String text;

        public static Type transByName(String name) {
            if (StringUtils.isEmpty(name)) return TEAM;
            switch (name) {
                case "公司":
                    return CORP;
                case "部门":
                    return DEPT;
                case "班组":
                default:
                    return TEAM;
            }
        }
    }

}
