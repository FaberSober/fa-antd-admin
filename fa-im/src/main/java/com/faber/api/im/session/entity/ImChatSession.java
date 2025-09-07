package com.faber.api.im.session.entity;

import com.faber.core.bean.BaseDelEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/**
 * 聊天会话实体类
 *
 * @author faber
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("im_chat_session")
public class ImChatSession extends BaseDelEntity {
    
    private Long id;
    /**
     * 会话ID
     */
    @TableField("session_id")
    private String sessionId;

    /**
     * 会话类型: 1单聊 2群聊
     */
    @TableField("session_type")
    private Integer sessionType;

    /**
     * 会话名称
     */
    @TableField("session_name")
    private String sessionName;

    /**
     * 会话头像
     */
    @TableField("session_avatar")
    private String sessionAvatar;

    /**
     * 参与用户ID列表(逗号分隔)
     */
    @TableField("user_ids")
    private String userIds;

    /**
     * 最后消息ID
     */
    @TableField("last_message_id")
    private Long lastMessageId;

    /**
     * 最后消息时间
     */
    @TableField("last_message_time")
    private Date lastMessageTime;

    /**
     * 最后消息内容
     */
    @TableField("last_message_content")
    private String lastMessageContent;

    /**
     * 未读消息数
     */
    @TableField("unread_count")
    private Integer unreadCount;
}