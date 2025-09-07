package com.faber.api.im.message.biz;

import com.faber.api.im.message.entity.ImUserMessage;
import com.faber.api.im.message.mapper.ImUserMessageMapper;
import com.faber.core.biz.BaseBiz;
import org.springframework.stereotype.Service;

/**
 * 用户消息状态业务逻辑
 *
 * @author faber
 */
@Service
public class ImUserMessageBiz extends BaseBiz<ImUserMessageMapper, ImUserMessage> {
}