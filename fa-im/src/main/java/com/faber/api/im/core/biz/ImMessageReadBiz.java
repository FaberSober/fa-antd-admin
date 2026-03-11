package com.faber.api.im.core.biz;

import org.springframework.stereotype.Service;

import com.faber.api.im.core.entity.ImMessageRead;
import com.faber.api.im.core.mapper.ImMessageReadMapper;
import com.faber.core.web.biz.BaseBiz;

/**
 * IM-消息已读状态表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-09-07 21:51:31
 */
@Service
public class ImMessageReadBiz extends BaseBiz<ImMessageReadMapper,ImMessageRead> {
}