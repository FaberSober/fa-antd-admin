package com.faber.api.disk.store.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import com.faber.core.config.easyexcel.type.FaJsonObj;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import java.io.Serializable;


/**
 * STORE-文件
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-22 09:31:17
 */
@Data
@FaModalName(name = "STORE-文件")
@TableName(value = "disk_store_file", autoResultMap = true)
public class StoreFile extends BaseDelEntity {

    @SqlTreeId
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @NotNull
    @SqlEquals
    @ExcelProperty("库ID")
    private Integer bucketId;

    @SqlTreeName
    @ExcelProperty("文件夹名称")
    private String name;

    @NotNull
    @SqlEquals
    @SqlTreeParentId
    @ExcelProperty("父级节点")
    private Integer parentId;

    @SqlSorter
    private Integer sort;

    @NotNull
    @ExcelProperty("是否文件夹")
    private Boolean dir;

    @ExcelProperty("文件大小(KB)")
    private Long size;

    @SqlEquals
    @ExcelProperty("文件类型")
    private String type;

    @SqlEquals
    @ExcelProperty("文件ID")
    private String fileId;

    @ExcelProperty("完整路径")
    private String fullPath;

    @TableField(typeHandler = JacksonTypeHandler.class)
    @ExcelProperty("标签")
    private Tag[] tags;

    @ExcelProperty("文件信息")
    private String info;

    @ExcelProperty("是否有删除动作")
    private Boolean deleteAction;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Tag implements Serializable, FaJsonObj {
        private Integer id;
        private Integer tagId;
        private String name;
        private String color;
    }

}
