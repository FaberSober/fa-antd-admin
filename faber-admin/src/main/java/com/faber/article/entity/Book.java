package com.faber.article.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.annotation.SqlSearch;
import com.faber.common.bean.BaseDelEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.ToString;

import java.util.Date;
import javax.persistence.*;


/**
 * 文章-书本
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-31 13:53:39
 */
@FaberModalName(name = "文章-书本")
@Table(name = "article_book")
@Data
public class Book extends BaseDelEntity {
	private static final long serialVersionUID = 1L;
	
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlSearch
    @ExcelProperty("编码")
    @Column(name = "no")
    private String no;

    @SqlSearch
    @ExcelProperty("书名")
    @Column(name = "name")
    private String name;

    @SqlEquals
    @ExcelProperty("业务类型")
    @Column(name = "biz_type")
    private String bizType;

    @SqlEquals
    @ExcelProperty("业务ID")
    @Column(name = "biz_id")
    private String bizId;

    @ExcelProperty("封面图")
    @Column(name = "cover")
    private String cover;

    @ExcelProperty("描述")
    @Column(name = "description")
    private String description;

    @SqlEquals
    @ExcelProperty("是否发布")
    @Column(name = "pub")
    private Boolean pub;

    @ExcelProperty("发布时间")
    @Column(name = "pub_time")
    private Date pubTime;

    @ToString
    @AllArgsConstructor
    public enum BizType {
        Help("Help", "帮助文章"),
        PigKnowledge("PigKnowledge", "养殖知识");

        public final String value;
        public final String text;
    }

}
