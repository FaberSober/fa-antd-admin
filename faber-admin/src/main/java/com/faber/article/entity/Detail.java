package com.faber.article.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;

import javax.persistence.*;


/**
 * 文章-详情
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-31 13:53:39
 */
@FaberModalName(name = "文章-详情")
@Table(name = "article_detail")
@Data
public class Detail extends BaseDelEntity {
	private static final long serialVersionUID = 1L;
	
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
    @ExcelProperty("大纲ID")
    @Column(name = "outline_id")
    private Integer outlineId;

    @ExcelProperty("html文本")
    @Column(name = "detail")
    private String detail;

}
