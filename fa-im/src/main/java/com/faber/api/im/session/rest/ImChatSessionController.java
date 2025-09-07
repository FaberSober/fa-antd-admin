package com.faber.api.im.session.rest;

import com.faber.api.im.session.biz.ImChatSessionBiz;
import com.faber.api.im.session.entity.ImChatSession;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 聊天会话控制器
 *
 * @author faber
 */
@RestController
@RequestMapping("/api/im/session/chatSession")
public class ImChatSessionController extends BaseController<ImChatSessionBiz, ImChatSession, Long> {
}