package com.faber.api.disk.store.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

import jakarta.validation.constraints.NotNull;


/**
 * STORE-标签
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-12-27 11:25:19
 */
@FaModalName(name = "STORE-标签")
@TableName("disk_store_tag")
@Data
public class StoreTag extends BaseDelEntity {


    @SqlTreeId
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @NotNull
    @SqlEquals
    @ExcelProperty("库ID")
    private Integer bucketId;

    @SqlEquals
    @SqlTreeParentId
    private Integer parentId;

    @SqlTreeName
    @ExcelProperty("名称")
    private String name;

    @ExcelProperty("颜色")
    private String color;

    @SqlSorter
    private Integer sort;

}
