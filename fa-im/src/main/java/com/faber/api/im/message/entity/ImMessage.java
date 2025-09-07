package com.faber.api.im.message.entity;

import com.faber.core.bean.BaseDelEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/**
 * 消息实体类
 *
 * @author faber
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("im_message")
public class ImMessage extends BaseDelEntity {
    
    private Long id;
    /**
     * 消息ID
     */
    @TableField("message_id")
    private String messageId;

    /**
     * 会话ID
     */
    @TableField("session_id")
    private String sessionId;

    /**
     * 发送者ID
     */
    @TableField("sender_id")
    private Long senderId;

    /**
     * 消息类型: 1文本 2图片 3文件 4语音 5视频 6表情 7混合
     */
    @TableField("message_type")
    private Integer messageType;

    /**
     * 消息内容
     */
    @TableField("content")
    private String content;

    /**
     * 文件ID
     */
    @TableField("file_id")
    private String fileId;

    /**
     * 文件名称
     */
    @TableField("file_name")
    private String fileName;

    /**
     * 文件大小
     */
    @TableField("file_size")
    private Long fileSize;

    /**
     * 文件URL
     */
    @TableField("file_url")
    private String fileUrl;

    /**
     * 发送时间
     */
    @TableField("send_time")
    private Date sendTime;
}