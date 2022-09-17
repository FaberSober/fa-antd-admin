package com.faber.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.bean.BaseCrtEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import com.baomidou.mybatisplus.annotation.TableName;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
@TableName("base_resource_authority")
public class ResourceAuthority extends BaseCrtEntity {
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
    @ExcelProperty("角色ID")
    // @Column(name = "authority_id")
    private String authorityId;

    @SqlEquals
    @ExcelProperty("角色类型")
    // @Column(name = "authority_type")
    private String authorityType;

    @SqlEquals
    @ExcelProperty("资源ID")
    // @Column(name = "resource_id")
    private String resourceId;

    @SqlEquals
    @ExcelProperty("授权类型")
    // @Column(name = "resource_type")
    private String resourceType;

    @SqlEquals
    @ExcelProperty("父节点ID")
    // @Column(name = "parent_id")
    private String parentId;

    @ExcelProperty("路径")
    // @Column(name = "path")
    private String path;

    @ExcelProperty("描述")
    // @Column(name = "description")
    private String description;

    public ResourceAuthority(String authorityType, String resourceType) {
        this.authorityType = authorityType;
        this.resourceType = resourceType;
    }


    public static final class ResourceType {
        /**
         * 关联{@link Menu#getId()}
         */
        public static final String MENU = "menu";
        /**
         * 关联{@link Element#getId()}
         */
        public static final String BUTTON = "button";
    }

    public static final class AuthorityType {
        /**
         * 关联{@link Group}
         */
        public static final String GROUP = "group";
    }

}
