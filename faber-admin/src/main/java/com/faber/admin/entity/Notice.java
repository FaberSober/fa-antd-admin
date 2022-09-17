package com.faber.admin.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.alibaba.excel.annotation.ExcelProperty;
import com.faber.common.annotation.FaberModalName;
import com.faber.common.annotation.SqlEquals;
import com.faber.common.bean.BaseDelEntity;
import lombok.Data;

import javax.persistence.*;


/**
 * BASE-通知与公告
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2021-01-07 09:37:36
 */
@FaberModalName(name = "BASE-通知与公告")
@Table(name = "base_notice")
@Data
public class Notice extends BaseDelEntity {
	private static final long serialVersionUID = 1L;
	
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("标题")
    @Column(name = "title")
    private String title;

    @ExcelProperty("内容")
    @Column(name = "content")
    private String content;

    @SqlEquals
    @ExcelProperty("是否有效：1-有效、2-失效")
    @Column(name = "status")
    private String status;

    @SqlEquals
    @ExcelProperty("是否强提醒")
    @Column(name = "strong_notice")
    private String strongNotice;

}
