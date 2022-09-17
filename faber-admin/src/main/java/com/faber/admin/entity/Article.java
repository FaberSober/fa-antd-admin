package com.faber.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.bean.BaseUpdEntity;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;


/**
 * html文章
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-17 20:15:13
 */
@Table(name = "base_article")
@Data
@NoArgsConstructor
public class Article extends BaseUpdEntity {
	private static final long serialVersionUID = 1L;

    @TableId(type = IdType.AUTO)
    private Integer id;

    @SqlEquals
    @Column(name = "biz_id")
    private Integer bizId;

    public static final class BizType {
        public static final String BASE_HELP = "base_help";
    }

    @SqlEquals
    @Column(name = "biz_type")
    private String bizType;

	    //html文本
    @Column(name = "detail")
    private String detail;
	
    public Article(Integer bizId, String bizType) {
        this.bizId = bizId;
        this.bizType = bizType;
    }
}
