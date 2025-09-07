package com.faber.api.im.message.rest;

import com.faber.api.im.message.biz.ImUserMessageBiz;
import com.faber.api.im.message.entity.ImUserMessage;
import com.faber.core.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用户消息状态控制器
 *
 * @author faber
 */
@RestController
@RequestMapping("/api/im/message/userMessage")
public class ImUserMessageController extends BaseController<ImUserMessageBiz, ImUserMessage, Long> {
}