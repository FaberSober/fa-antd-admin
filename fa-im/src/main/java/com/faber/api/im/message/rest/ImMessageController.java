package com.faber.api.im.message.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.faber.api.im.message.biz.ImMessageBiz;
import com.faber.api.im.message.entity.ImMessage;
import com.faber.core.web.rest.BaseController;

/**
 * 消息控制器
 *
 * @author faber
 */
@RestController
@RequestMapping("/api/im/message/message")
public class ImMessageController extends BaseController<ImMessageBiz, ImMessage, Long> {
    
}