package com.faber.api.base.demo.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;


/**
 * DEMO-tree数据
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2022/11/30 18:28
 */
@TableName("demo_tree")
@Data
@ToString
@EqualsAndHashCode(callSuper = false)
public class Tree extends BaseDelEntity {

    @SqlTreeId
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlTreeName
    @ExcelProperty("名称")
    private String name;

    @SqlTreeParentId
    @SqlEquals
    @ExcelProperty("上级节点")
    private Integer parentId;

    @SqlSorter
    @ExcelProperty("排序ID")
    private Integer sort;

}
