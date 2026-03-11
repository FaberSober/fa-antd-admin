package com.faber.api.im.core.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.web.rest.BaseController;
import com.faber.api.im.core.biz.ImParticipantBiz;
import com.faber.api.im.core.entity.ImParticipant;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * IM-会话参与者表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-09-07 21:51:31
 */
@FaLogBiz("IM-会话参与者表")
@RestController
@RequestMapping("/api/im/core/imParticipant")
public class ImParticipantController extends BaseController<ImParticipantBiz, ImParticipant, Long> {

}