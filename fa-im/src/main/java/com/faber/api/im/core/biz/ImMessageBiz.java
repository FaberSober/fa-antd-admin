package com.faber.api.im.core.biz;

import org.springframework.stereotype.Service;

import com.faber.api.im.core.entity.ImMessage;
import com.faber.api.im.core.mapper.ImMessageMapper;
import com.faber.core.web.biz.BaseBiz;

/**
 * IM-消息表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-09-07 21:51:31
 */
@Service
public class ImMessageBiz extends BaseBiz<ImMessageMapper,ImMessage> {
}