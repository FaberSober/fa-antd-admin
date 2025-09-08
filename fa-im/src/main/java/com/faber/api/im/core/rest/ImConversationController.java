package com.faber.api.im.core.rest;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.validator.validator.Vg;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import com.faber.api.im.core.biz.ImConversationBiz;
import com.faber.api.im.core.entity.ImConversation;
import com.faber.api.im.core.vo.req.ImConversationCreateNewSingleReqVo;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * IM-会话表
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-09-07 21:51:31
 */
@FaLogBiz("IM-会话表")
@RestController
@RequestMapping("/api/im/core/imConversation")
public class ImConversationController extends BaseController<ImConversationBiz, ImConversation, Long> {

    @FaLogOpr(value = "开启新单聊", crud = LogCrudEnum.C)
    @RequestMapping(value = "/createNewSingle", method = RequestMethod.POST)
    @ResponseBody
    public Ret<ImConversation> createNewSingle(@Validated(value = Vg.Crud.C.class) @RequestBody ImConversationCreateNewSingleReqVo reqVo) {
        ImConversation data = baseBiz.createNewSingle(reqVo);
        return ok(data);
    }

}