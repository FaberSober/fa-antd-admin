package com.faber.api.im.group.entity;

import com.faber.core.bean.BaseDelEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 群聊信息实体类
 *
 * @author faber
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("im_group")
public class ImGroup extends BaseDelEntity {
    /**
     * 群ID
     */
    @TableField("group_id")
    private String groupId;

    /**
     * 群名称
     */
    @TableField("group_name")
    private String groupName;

    /**
     * 群头像
     */
    @TableField("group_avatar")
    private String groupAvatar;

    /**
     * 群公告
     */
    @TableField("group_notice")
    private String groupNotice;

    /**
     * 创建者ID
     */
    @TableField("creator_id")
    private Long creatorId;

    /**
     * 最大成员数
     */
    @TableField("max_members")
    private Integer maxMembers;

    /**
     * 当前成员数
     */
    @TableField("current_members")
    private Integer currentMembers;
}