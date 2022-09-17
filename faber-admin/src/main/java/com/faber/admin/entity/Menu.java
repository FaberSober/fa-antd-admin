package com.faber.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.*;
import com.faber.common.bean.BaseDelEntity;
import com.faber.common.constant.CommonConstants;
import lombok.Data;

import javax.persistence.*;

@Data
@Table(name = "base_menu")
public class Menu extends BaseDelEntity {
    @TableId(type = IdType.AUTO)
    @SqlTreeId
    private Integer id;

    @SqlEquals
    @ExcelProperty("所属模块ID")
    @Column(name = "block_id")
    private Integer blockId;

    @ExcelProperty("菜单编码")
    @Column(name = "code")
    private String code;

    @SqlTreeName
    @ExcelProperty("菜单名称")
    @Column(name = "title")
    private String title;

    @SqlTreeParentId
    @SqlEquals
    @ExcelProperty("父级节点")
    @Column(name = "parent_id")
    private Integer parentId = CommonConstants.ROOT;

    @ExcelProperty("资源路径")
    @Column(name = "href")
    private String href;

    @ExcelProperty("图标")
    @Column(name = "icon")
    private String icon;

    @SqlEquals
    @ExcelProperty("类型：menu、dirt")
    @Column(name = "type")
    private String type;

    @ExcelProperty("描述")
    @Column(name = "description")
    private String description;

    @Deprecated
    @ExcelProperty("菜单上下级关系")
    @Column(name = "path")
    private String path;

    @SqlSorter
    @ExcelProperty("排序")
    @Column(name = "order_num")
    private Integer orderNum;

}
