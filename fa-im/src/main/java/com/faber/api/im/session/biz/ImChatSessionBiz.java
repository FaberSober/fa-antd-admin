package com.faber.api.im.session.biz;

import com.faber.api.im.session.entity.ImChatSession;
import com.faber.api.im.session.mapper.ImChatSessionMapper;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;

/**
 * 聊天会话业务逻辑
 *
 * @author faber
 */
@Service
public class ImChatSessionBiz extends BaseBiz<ImChatSessionMapper, ImChatSession> {
}