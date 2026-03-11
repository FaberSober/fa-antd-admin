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
import com.faber.core.context.BaseContextHandler;

import lombok.extern.slf4j.Slf4j;

import java.util.List;
import java.util.Map;
import java.util.concurrent.Executor;

import org.springframework.beans.factory.annotation.Autowired;
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

    @Autowired
    private Executor executor;

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

            msg.setType(msgSendConfig.getType());

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

            msgSendConfig.beforeSave(msg);
            msgBiz.save(msg);
        }
    }

    @Override
    public <T extends MsgSendConfig> void sendSysMsg(String fromUserId, List<String> toUserIds, T msgSendConfig) {
        if (toUserIds == null || toUserIds.size() == 0) return;
        this.sendSysMsg(fromUserId, toUserIds.toArray(new String[0]), msgSendConfig);
    }

    @Override
    public <T extends MsgSendConfig> void sendSysMsgAsync(String fromUserId, String toUserId, T msgSendConfig) {
        Map<String, Object> holder = BaseContextHandler.getHoldMap();
        executor.execute(() -> {
            BaseContextHandler.setHoldMap(holder);
            this.sendSysMsg(fromUserId, toUserId, msgSendConfig);
        });
    }

    @Override
    public <T extends MsgSendConfig> void sendSysMsgAsync(String fromUserId, String[] toUserIds, T msgSendConfig) {
        Map<String, Object> holder = BaseContextHandler.getHoldMap();
        executor.execute(() -> {
            BaseContextHandler.setHoldMap(holder);
            this.sendSysMsg(fromUserId, toUserIds, msgSendConfig);
        });
    }

    @Override
    public <T extends MsgSendConfig> void sendSysMsgAsync(String fromUserId, List<String> toUserIds, T msgSendConfig) {
        Map<String, Object> holder = BaseContextHandler.getHoldMap();
        executor.execute(() -> {
            BaseContextHandler.setHoldMap(holder);
            this.sendSysMsg(fromUserId, toUserIds, msgSendConfig);
        });
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
