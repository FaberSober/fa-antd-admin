package com.faber.api.im.message.rest;

import com.faber.api.im.message.biz.ImMessageBiz;
import com.faber.api.im.message.biz.ImUserMessageBiz;
import com.faber.api.im.message.entity.ImMessage;
import com.faber.api.im.message.entity.ImUserMessage;
import com.faber.core.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 消息控制器
 *
 * @author faber
 */
@RestController
@RequestMapping("/api/im/message")
public class ImMessageController extends BaseController<ImMessageBiz, ImMessage, Long> {
    
    private final ImUserMessageBiz imUserMessageBiz;
    
    public ImMessageController(ImUserMessageBiz imUserMessageBiz) {
        this.imUserMessageBiz = imUserMessageBiz;
    }
    
    /**
     * 用户消息状态相关接口
     */
    @RequestMapping("/user/**")
    public Object userMessageApi() {
        // 代理到ImUserMessageController
        return null;
    }
}