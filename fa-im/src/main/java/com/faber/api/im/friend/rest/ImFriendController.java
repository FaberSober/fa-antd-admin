package com.faber.api.im.friend.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.faber.api.im.friend.biz.ImFriendBiz;
import com.faber.api.im.friend.entity.ImFriend;
import com.faber.core.web.rest.BaseController;

/**
 * 用户好友关系控制器
 *
 * @author faber
 */
@RestController
@RequestMapping("/api/im/friend/friend")
public class ImFriendController extends BaseController<ImFriendBiz, ImFriend, Long> {

}