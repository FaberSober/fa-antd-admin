package com.faber.api.im.friend.entity;

import com.faber.core.bean.BaseDelEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 用户好友关系实体类
 *
 * @author faber
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("im_friend")
public class ImFriend extends BaseDelEntity {
    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 好友ID
     */
    @TableField("friend_id")
    private Long friendId;

    /**
     * 好友分组ID
     */
    @TableField("friend_group_id")
    private Long friendGroupId;

    /**
     * 好友备注
     */
    @TableField("remark")
    private String remark;
}