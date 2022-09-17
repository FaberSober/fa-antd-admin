package com.faber.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.*;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;


/**
 * 字典分类
 */
@Table(name = "base_dict_type")
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public class DictType extends BaseDelEntity {

    @TableId(type = IdType.AUTO)
    @SqlTreeId
    private Integer id;

    @ExcelProperty("编码")
    @Column(name = "code")
    private String code;

    @ExcelProperty("名称")
    @Column(name = "name")
    @SqlTreeName
    private String name;

    @SqlEquals
    @ExcelProperty("上级节点")
    @Column(name = "parent_id")
    @SqlTreeParentId
    private Integer parentId;

    @SqlSorter
    @ExcelProperty("排序ID")
    @Column(name = "sort_id")
    private Integer sortId;

    @ExcelProperty("描述")
    @Column(name = "description")
    private String description;

    public static final class Code {
        /**
         * {@link GroupUser#getType()}
         */
        public static final String GROUP_USER_TYPE = "group_user_type";
        /**
         * {@link Area#getLevel()}
         */
        public static final String COMMON_AREA_LEVEL = "common_area_level";
    }


}
