package com.faber.api.im.group.rest;

import com.faber.api.im.group.biz.ImGroupBiz;
import com.faber.api.im.group.biz.ImGroupMemberBiz;
import com.faber.api.im.group.entity.ImGroup;
import com.faber.api.im.group.entity.ImGroupMember;
import com.faber.core.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 群聊信息控制器
 *
 * @author faber
 */
@RestController
@RequestMapping("/api/im/group")
public class ImGroupController extends BaseController<ImGroupBiz, ImGroup, Long> {
    
    private final ImGroupMemberBiz imGroupMemberBiz;
    
    public ImGroupController(ImGroupMemberBiz imGroupMemberBiz) {
        this.imGroupMemberBiz = imGroupMemberBiz;
    }
    
    /**
     * 群成员相关接口
     */
    @RequestMapping("/member/**")
    public Object groupMemberApi() {
        // 代理到ImGroupMemberController
        return null;
    }
}