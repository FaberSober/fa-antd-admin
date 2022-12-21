package com.faber.api.base.msg.entity;

import com.alibaba.excel.annotation.ExcelProperty;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.annotation.SqlSearch;
import com.faber.core.bean.BaseDelEntity;
import com.faber.api.base.admin.enums.MsgBuzzTypeEnum;
import lombok.Data;

import java.util.Date;


/**
 * 系统-消息
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-12-13 21:19:53
 */
@FaModalName(name = "系统-消息")
@TableName("base_msg")
@Data
public class Msg extends BaseDelEntity {

    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @ExcelProperty("来源用户")
    private String fromUserName;

    @SqlEquals
    @ExcelProperty("来源用户ID")
    private String fromUserId;

    @ExcelProperty("接收用户")
    private String toUserName;

    @SqlEquals
    @ExcelProperty("接收用户ID")
    private String toUserId;

    @SqlSearch
    @ExcelProperty("消息内容")
    private String content;

    @SqlEquals
    @ExcelProperty("是否已读")
    private Boolean isRead;

    @ExcelProperty("已读时间")
    private Date readTime;

    @SqlEquals
    @ExcelProperty("业务类型")
    private MsgBuzzTypeEnum buzzType;

    @SqlEquals
    @ExcelProperty("业务ID")
    private String buzzId;

}
