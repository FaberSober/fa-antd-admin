package com.faber.article.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.*;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;

import javax.persistence.*;


/**
 * 文章-大纲
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-31 13:53:39
 */
@FaberModalName(name = "文章-大纲")
@Table(name = "article_outline")
@Data
public class Outline extends BaseDelEntity {
	private static final long serialVersionUID = 1L;
	
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    @SqlTreeId
    private Integer id;

    @SqlEquals
    @ExcelProperty("书本ID")
    @Column(name = "book_id")
    private Integer bookId;

    @SqlEquals
    @ExcelProperty("详情ID")
    @Column(name = "detail_id")
    private Integer detailId;

    @SqlEquals
    @ExcelProperty("父级节点")
    @Column(name = "parent_id")
    @SqlTreeParentId
    private Integer parentId;

    @ExcelProperty("章节号")
    @Column(name = "no")
    @SqlTreeName
    private String no;

    @ExcelProperty("标题")
    @Column(name = "title")
    @SqlTreeName
    private String title;

    @ExcelProperty("图标")
    @Column(name = "icon")
    private String icon;

    @SqlSorter
    @ExcelProperty("排序")
    @Column(name = "sort")
    private Integer sort;

}
