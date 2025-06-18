package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;


/**
 * BASE-通知与公告
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2021-01-07 09:37:36
 */
@FaModalName(name = "BASE-通知与公告")
@TableName("base_notice")
@Data
public class Notice extends BaseDelEntity {
	private static final long serialVersionUID = 1L;
	
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("标题")
    private String title;

    @ExcelProperty("内容")
    private String content;

    @SqlEquals
    @ExcelProperty("是否有效")
    private Boolean status;

    @SqlEquals
    @ExcelProperty("是否强提醒")
    private Boolean strongNotice;

}
