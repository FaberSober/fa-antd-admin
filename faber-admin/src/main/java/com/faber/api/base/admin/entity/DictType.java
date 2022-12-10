package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.config.easyexcel.type.FaJsonObj;
import com.faber.core.config.mybatis.handler.AbstractObjectTypeHandler;
import com.faber.core.config.mybatis.handler.GenericAndJson;
import com.faber.core.config.validator.validator.Vg;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Null;
import java.io.Serializable;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;


/**
 * 字典分类
 */
@TableName(value = "base_dict_type", autoResultMap = true)
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public class DictType extends BaseDelEntity {

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

    @NotNull
    @ExcelProperty("字典列表")
    @TableField(typeHandler = DictTypeHandler.class)
    private List<Dict> dicts;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Dict implements Serializable, FaJsonObj {
        /**
         * 这里的ID只是用来排序的，保存时不能保存此ID。要保存value！
         */
        private Integer id;
        private String value;
        private String label;
        private Boolean deleted;
    }

    public static class DictTypeHandler extends AbstractObjectTypeHandler<List<Dict>> {
//        @Override
//        public List<Dict> getNullableResult(ResultSet rs, String columnName) throws SQLException {
//            String string = rs.getString(columnName);
//            return GenericAndJson.jsonToObject(string, new TypeReference<List<Dict>>() {
//            });
//        }
    }

}
