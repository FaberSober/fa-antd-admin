package com.faber.api.im.friend.entity;

import com.faber.core.bean.BaseDelEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 好友分组实体类
 *
 * @author faber
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("im_friend_group")
public class ImFriendGroup extends BaseDelEntity {
    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 分组名称
     */
    @TableField("group_name")
    private String groupName;

    /**
     * 排序
     */
    @TableField("sort")
    private Integer sort;
}