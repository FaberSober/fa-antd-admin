package com.faber.api.im.friend.rest;

import com.faber.api.im.friend.biz.ImFriendBiz;
import com.faber.api.im.friend.biz.ImFriendGroupBiz;
import com.faber.api.im.friend.entity.ImFriend;
import com.faber.api.im.friend.entity.ImFriendGroup;
import com.faber.core.rest.BaseController;
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
    
    private final ImFriendGroupBiz imFriendGroupBiz;
    
    public ImFriendController(ImFriendGroupBiz imFriendGroupBiz) {
        this.imFriendGroupBiz = imFriendGroupBiz;
    }
    
    /**
     * 好友分组相关接口
     */
    @RequestMapping("/group/**")
    public Object friendGroupApi() {
        // 代理到ImFriendGroupController
        return null;
    }
}