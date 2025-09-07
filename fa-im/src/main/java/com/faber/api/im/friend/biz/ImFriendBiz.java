package com.faber.api.im.friend.biz;

import com.faber.api.im.friend.entity.ImFriend;
import com.faber.api.im.friend.mapper.ImFriendMapper;
import com.faber.core.biz.BaseBiz;
import org.springframework.stereotype.Service;

/**
 * 用户好友关系业务逻辑
 *
 * @author faber
 */
@Service
public class ImFriendBiz extends BaseBiz<ImFriendMapper, ImFriend> {
}