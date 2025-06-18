package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

import java.util.Date;


/**
 * BASE-系统-新闻
 * 
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2023-12-18 10:17:26
 */
@FaModalName(name = "BASE-系统-新闻")
@TableName("base_sys_news")
@Data
public class SysNews extends BaseDelEntity {
	
    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("标题")
    private String title;

    @ExcelProperty("内容")
    private String content;

    @ExcelProperty("封面")
    private String cover;

    @ExcelProperty("作者")
    private String author;

    @ExcelProperty("发布时间")
    private Date pubTime;

}
