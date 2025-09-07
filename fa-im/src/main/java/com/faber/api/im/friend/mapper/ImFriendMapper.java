package com.faber.api.im.friend.mapper;

import com.faber.api.im.friend.entity.ImFriend;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户好友关系Mapper接口
 *
 * @author faber
 */
@Mapper
public interface ImFriendMapper extends FaBaseMapper<ImFriend> {
}