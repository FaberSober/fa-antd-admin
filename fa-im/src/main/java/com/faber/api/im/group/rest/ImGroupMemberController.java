package com.faber.api.im.group.rest;

import com.faber.api.im.group.biz.ImGroupMemberBiz;
import com.faber.api.im.group.entity.ImGroupMember;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 群成员控制器
 *
 * @author faber
 */
@RestController
@RequestMapping("/api/im/group/groupMember")
public class ImGroupMemberController extends BaseController<ImGroupMemberBiz, ImGroupMember, Long> {
}