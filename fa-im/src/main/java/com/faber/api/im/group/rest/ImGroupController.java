package com.faber.api.im.group.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.faber.api.im.group.biz.ImGroupBiz;
import com.faber.api.im.group.entity.ImGroup;
import com.faber.core.web.rest.BaseController;

/**
 * 群聊信息控制器
 *
 * @author faber
 */
@RestController
@RequestMapping("/api/im/group/group")
public class ImGroupController extends BaseController<ImGroupBiz, ImGroup, Long> {

}