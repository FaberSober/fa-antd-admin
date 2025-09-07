package com.faber.api.im.friend.rest;

import com.faber.api.im.friend.biz.ImFriendGroupBiz;
import com.faber.api.im.friend.entity.ImFriendGroup;
import com.faber.core.web.rest.BaseController;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 好友分组控制器
 *
 * @author faber
 */
@RestController
@RequestMapping("/api/im/friend/friendGroup")
public class ImFriendGroupController extends BaseController<ImFriendGroupBiz, ImFriendGroup, Long> {
}