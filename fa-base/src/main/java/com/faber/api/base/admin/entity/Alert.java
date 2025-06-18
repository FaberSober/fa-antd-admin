package com.faber.api.base.admin.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseDelEntity;
import lombok.Data;

import java.util.Date;


/**
 * BASE-告警信息
 * 
 * @author xu.pengfei
 * @email faberxu@gmail.com
 * @date 2023-12-16 11:40:20
 */
@FaModalName(name = "BASE-告警信息")
@TableName("base_alert")
@Data
public class Alert extends BaseDelEntity {
	
    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Integer id;

    @ExcelProperty("告警内容")
    private String content;

    @SqlEquals
    @ExcelProperty("告警类型")
    private String type;

    @ExcelProperty("是否处理")
    private Boolean deal;

    @ExcelProperty("负责人")
    private String dutyStaff;

    @ExcelProperty("处理人")
    private String dealStaff;

    @ExcelProperty("处理时间")
    private Date dealTime;

    @ExcelProperty("处理描述")
    private String dealDesc;

}
