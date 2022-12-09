package com.faber.api.base.article.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.*;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;


/**
 * 文章-大纲
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-31 13:53:39
 */
@FaModalName(name = "文章-大纲")
@TableName("article_outline")
@Data
public class Outline extends BaseDelEntity {
	private static final long serialVersionUID = 1L;
	
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    @SqlTreeId
    private Integer id;

    @SqlEquals
    @ExcelProperty("书本ID")
    private Integer bookId;

    @SqlEquals
    @ExcelProperty("详情ID")
    private Integer detailId;

    @SqlEquals
    @ExcelProperty("父级节点")
    @SqlTreeParentId
    private Integer parentId;

    @ExcelProperty("章节号")
    @SqlTreeName
    private String no;

    @ExcelProperty("标题")
    @SqlTreeName
    private String title;

    @ExcelProperty("图标")
    private String icon;

    @SqlSorter
    @ExcelProperty("排序")
    private Integer sort;

}
