package com.faber.api.im.core.rest;

import java.util.List;

import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.faber.api.im.core.biz.ImConversationBiz;
import com.faber.api.im.core.entity.ImConversation;
import com.faber.api.im.core.entity.ImMessage;
import com.faber.api.im.core.entity.ImParticipant;
import com.faber.api.im.core.vo.req.ImConversationAddGroupUsersReqVo;
import com.faber.api.im.core.vo.req.ImConversationCreateNewGroupReqVo;
import com.faber.api.im.core.vo.req.ImConversationCreateNewSingleReqVo;
import com.faber.api.im.core.vo.req.ImConversationGetParticipantReqVo;
import com.faber.api.im.core.vo.req.ImConversationListQueryReqVo;
import com.faber.api.im.core.vo.req.ImConversationSendMsgReqVo;
import com.faber.api.im.core.vo.req.ImConversationUpdateReadReqVo;
import com.faber.api.im.core.vo.ret.ImConversationRetVo;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.validator.validator.Vg;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;

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

    @FaLogOpr(value = "开启新群聊", crud = LogCrudEnum.C)
    @RequestMapping(value = "/createNewGroup", method = RequestMethod.POST)
    @ResponseBody
    public Ret<ImConversation> createNewGroup(@Validated(value = Vg.Crud.C.class) @RequestBody ImConversationCreateNewGroupReqVo reqVo) {
        ImConversation data = baseBiz.createNewGroup(reqVo);
        return ok(data);
    }

    @FaLogOpr(value = "加入群聊", crud = LogCrudEnum.C)
    @RequestMapping(value = "/addGroupUsers", method = RequestMethod.POST)
    @ResponseBody
    public Ret<ImConversation> addGroupUsers(@Validated(value = Vg.Crud.C.class) @RequestBody ImConversationAddGroupUsersReqVo reqVo) {
        ImConversation data = baseBiz.addGroupUsers(reqVo);
        return ok(data);
    }

    @FaLogOpr(value = "聊天查询", crud = LogCrudEnum.R)
    @RequestMapping(value = "/listQuery", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<ImConversationRetVo>> listQuery(@RequestBody ImConversationListQueryReqVo reqVo) {
        List<ImConversationRetVo> list = baseBiz.listQuery(reqVo);
        return ok(list);
    }

    @FaLogOpr(value = "发送消息", crud = LogCrudEnum.C)
    @RequestMapping(value = "/sendMsg", method = RequestMethod.POST)
    @ResponseBody
    public Ret<ImMessage> sendMsg(@Validated(value = Vg.Crud.C.class) @RequestBody ImConversationSendMsgReqVo reqVo) {
        ImMessage data = baseBiz.sendMsg(reqVo);
        return ok(data);
    }

    @FaLogOpr(value = "更新聊天已读", crud = LogCrudEnum.C)
    @RequestMapping(value = "/updateConversationRead", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> updateConversationRead(@Validated(value = Vg.Crud.C.class) @RequestBody ImConversationUpdateReadReqVo reqVo) {
        baseBiz.updateConversationRead(getCurrentUserId(), reqVo.getConversationId());
        return ok();
    }

    @FaLogOpr(value = "获取未读消息数量", crud = LogCrudEnum.R)
    @RequestMapping(value = "/getUnreadCount", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Integer> getUnreadCount() {
        Integer o = baseBiz.getUnreadCount();
        return ok(o);
    }

    @FaLogOpr(value = "获取聊天参与者", crud = LogCrudEnum.C)
    @RequestMapping(value = "/getParticipant", method = RequestMethod.POST)
    @ResponseBody
    public Ret<List<ImParticipant>> getParticipant(@Validated(value = Vg.Crud.C.class) @RequestBody ImConversationGetParticipantReqVo reqVo) {
        List<ImParticipant> list = baseBiz.getParticipant(reqVo);
        return ok(list);
    }

}