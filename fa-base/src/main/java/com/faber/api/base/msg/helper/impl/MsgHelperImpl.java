package com.faber.api.base.msg.helper.impl;

import cn.hutool.json.JSONUtil;
import com.faber.api.base.admin.biz.UserBiz;
import com.faber.api.base.admin.entity.User;
import com.faber.api.base.msg.helper.config.MsgSendConfig;
import com.faber.api.base.msg.helper.properties.SmsConfiguration;
import com.faber.api.base.msg.biz.MsgBiz;
import com.faber.api.base.msg.helper.MsgHelper;
import com.faber.api.base.msg.entity.Msg;
import com.faber.config.websocket.WsHolder;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import jakarta.annotation.Resource;

@Slf4j
@Component
public class MsgHelperImpl implements MsgHelper {

    @Resource
    private MsgBiz msgBiz;

    @Resource
    private UserBiz userBiz;

    @Resource
    private SmsConfiguration smsConfiguration;

    @Override
    public <T extends MsgSendConfig> void sendSysMsg(String fromUserId, String toUserId, T msgSendConfig) {
        this.sendSysMsg(fromUserId, new String[]{toUserId}, msgSendConfig);
    }

    @Override
    public <T extends MsgSendConfig> void sendSysMsg(String fromUserId, String[] toUserIds, T msgSendConfig) {
        if (toUserIds == null || toUserIds.length == 0) return;

        User fromUser = userBiz.getByIdWithCache(fromUserId);
        for (String toUserId : toUserIds) {
            User toUser = userBiz.getByIdWithCache(toUserId);
            if (toUser == null) continue;

            Msg msg = this.genBaseMsg(fromUserId, toUserId, msgSendConfig);
            msg.setFromUserName(fromUser.getName());
            msg.setToUserName(toUser.getName());

            String appPushContent = smsConfiguration.genTemplateContent(msgSendConfig);
            msg.setContent(appPushContent);

            // 发送模板短信
            if (msgSendConfig.isSendSms()) {
                try {
                    smsConfiguration.sendSms(toUser.getTel(), msgSendConfig);
                } catch (Exception e) {
                    log.error(e.getMessage(), e);
                }
            }

            // send through websocket
            WsHolder.sendMessage(toUserId, "PLAIN_MSG", msg);

            msgBiz.save(msg);
        }
    }

    private Msg genBaseMsg(String fromUserId, String toUserId, MsgSendConfig msgSendConfig) {
        Msg msg = new Msg();
        msg.setFromUserId(fromUserId);
        msg.setToUserId(toUserId);
        msg.setBuzzType(msgSendConfig.getBuzzType());
        msg.setBuzzId(msgSendConfig.getBuzzId());
        msg.setIsRead(false);
        return msg;
    }
}
