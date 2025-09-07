package com.faber.api.im.message.biz;

import com.faber.api.im.message.entity.ImMessage;
import com.faber.api.im.message.mapper.ImMessageMapper;
import com.faber.core.biz.BaseBiz;
import org.springframework.stereotype.Service;

/**
 * 消息业务逻辑
 *
 * @author faber
 */
@Service
public class ImMessageBiz extends BaseBiz<ImMessageMapper, ImMessage> {
}