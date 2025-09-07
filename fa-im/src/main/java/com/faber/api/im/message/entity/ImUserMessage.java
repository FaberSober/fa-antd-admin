package com.faber.api.im.message.entity;

import com.faber.core.bean.BaseDelEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/**
 * 用户消息状态实体类
 *
 * @author faber
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("im_user_message")
public class ImUserMessage extends BaseDelEntity {
    /**
     * 消息ID
     */
    @TableField("message_id")
    private String messageId;

    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 会话ID
     */
    @TableField("session_id")
    private String sessionId;

    /**
     * 状态: 1未读 2已读 3已撤回
     */
    @TableField("status")
    private Integer status;

    /**
     * 阅读时间
     */
    @TableField("read_time")
    private Date readTime;
}