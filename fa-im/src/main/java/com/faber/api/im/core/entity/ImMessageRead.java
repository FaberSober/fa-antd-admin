package com.faber.api.im.core.entity;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Date;

import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

/**
 * IM-消息已读状态表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-09-07 21:51:31
 */
@FaModalName(name = "IM-消息已读状态表")
@TableName("im_message_read")
@Data
public class ImMessageRead implements Serializable {

    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @SqlEquals
    @ExcelProperty("消息ID")
    private Long messageId;

    @SqlEquals
    @ExcelProperty("用户ID")
    private String userId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")
    @TableField(fill = FieldFill.INSERT)
    @ExcelProperty("读取时间")
    private LocalDateTime readAt;

}
