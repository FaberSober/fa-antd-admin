package com.faber.api.im.friend.rest;

import com.faber.api.im.friend.biz.ImFriendBiz;
import com.faber.api.im.friend.biz.ImFriendGroupBiz;
import com.faber.api.im.friend.entity.ImFriend;
import com.faber.core.web.rest.BaseController;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户好友关系控制器
 *
 * @author faber
 */
@RestController
@RequestMapping("/api/im/friend")
public class ImFriendController extends BaseController<ImFriendBiz, ImFriend, Long> {
    
    /**
     * 好友分组相关接口
     */
    @RequestMapping("/group/**")
    public Object friendGroupApi() {
        // 代理到ImFriendGroupController
        return null;
    }
    
}