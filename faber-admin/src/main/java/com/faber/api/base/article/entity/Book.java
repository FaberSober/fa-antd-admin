package com.faber.api.base.article.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.annotation.SqlSearch;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

import java.util.Date;


/**
 * 文章-书本
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-31 13:53:39
 */
@FaModalName(name = "文章-书本")
@TableName("article_book")
@Data
public class Book extends BaseDelEntity {
	private static final long serialVersionUID = 1L;
	
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlSearch
    @ExcelProperty("编码")
    private String no;

    @SqlSearch
    @ExcelProperty("书名")
    private String name;

    @SqlEquals
    @ExcelProperty("业务类型")
    private String bizType;

    @SqlEquals
    @ExcelProperty("业务ID")
    private String bizId;

    @ExcelProperty("封面图")
    private String cover;

    @ExcelProperty("描述")
    private String description;

    @SqlEquals
    @ExcelProperty("是否发布")
    private Boolean pub;

    @ExcelProperty("发布时间")
    private Date pubTime;

}
