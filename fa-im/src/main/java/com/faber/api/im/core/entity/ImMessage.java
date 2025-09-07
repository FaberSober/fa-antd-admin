package com.faber.api.im.core.entity;

import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import com.alibaba.excel.annotation.write.style.ColumnWidth;
import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import com.faber.api.im.core.enums.ImMessageTypeEnum;
import com.faber.core.annotation.FaModalName;
import com.faber.core.annotation.FaPropIgnore;
import com.faber.core.annotation.SqlEquals;
import com.faber.core.bean.BaseCrtEntity;

import lombok.Data;

/**
 * IM-消息表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-09-07 21:51:31
 */
@FaModalName(name = "IM-消息表")
@TableName("im_message")
@Data
public class ImMessage extends BaseCrtEntity {

    @ColumnWidth(8)
    @ExcelProperty("ID")
    @TableId(type = IdType.AUTO)
    private Long id;

    @SqlEquals
    @ExcelProperty("会话ID")
    private Long conversationId;

    @SqlEquals
    @ExcelProperty("发送用户ID")
    private String senderId;

    @ExcelProperty("类型：1-文本/2-图片/3-视频/4-文件")
    private ImMessageTypeEnum type;

    @ExcelProperty("消息内容")
    private String content;

    @SqlEquals
    @ExcelProperty("附件ID")
    private String fileId;

    @ExcelProperty("是否撤回")
    private Boolean isWithdrawn;

    @FaPropIgnore
    @SqlEquals
    @ExcelIgnore
    @TableLogic(value = "false", delval = "true")
    @TableField(select = false, fill = FieldFill.INSERT)
    private Boolean deleted;

}
