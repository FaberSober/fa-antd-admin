package com.faber.api.im.group.entity;

import com.faber.core.bean.BaseDelEntity;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.Date;

/**
 * 群成员实体类
 *
 * @author faber
 */
@Data
@EqualsAndHashCode(callSuper = false)
@TableName("im_group_member")
public class ImGroupMember extends BaseDelEntity {
    
    private Long id;
    /**
     * 群ID
     */
    @TableField("group_id")
    private String groupId;

    /**
     * 用户ID
     */
    @TableField("user_id")
    private Long userId;

    /**
     * 群内昵称
     */
    @TableField("user_nickname")
    private String userNickname;

    /**
     * 角色: 1成员 2管理员 3群主
     */
    @TableField("role")
    private Integer role;

    /**
     * 加入时间
     */
    @TableField("join_time")
    private Date joinTime;
}