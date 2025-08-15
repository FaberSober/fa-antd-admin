package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.faber.api.base.admin.enums.DictTypeEnum;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.config.easyexcel.type.FaJsonObj;
import com.faber.core.config.validator.validator.Vg;
import lombok.*;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import java.io.Serializable;


/**
 * 字典分类
 */
@TableName(value = "base_dict", autoResultMap = true)
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public class Dict extends BaseDelEntity {

    @Null(groups = Vg.Crud.C.class)
    @NotNull(groups = Vg.Crud.U.class)
    @TableId(type = IdType.AUTO)
    @SqlTreeId
    private Integer id;

    @NotNull
    @ExcelProperty("编码")
    private String code;

    @NotNull
    @ExcelProperty("名称")
    @SqlTreeName
    private String name;

    @NotNull
    @SqlEquals
    @ExcelProperty("上级节点")
    @SqlTreeParentId
    private Integer parentId;

    @SqlSorter
    @ExcelProperty("排序ID")
    private Integer sortId;

    @ExcelProperty("描述")
    private String description;

    /** 1-选择列表，2-字符串，3-关联列表，4-关联树 */
    @ExcelProperty("数值类型")
    private DictTypeEnum type;

    @NotNull
    @ExcelProperty("字典列表")
    @TableField(typeHandler = JacksonTypeHandler.class)
    private Option[] options;

    @ExcelProperty("字典值")
    private String value;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Option implements Serializable, FaJsonObj {
        /**
         * 这里的ID只是用来排序的，保存时不能保存此ID。要保存value！
         */
        private Integer id;
        private String value;
        private String label;
        private Boolean deleted;
    }

}
