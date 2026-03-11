package com.faber.api.base.msg.helper;

import java.util.List;

import com.faber.api.base.msg.helper.config.MsgSendConfig;

public interface MsgHelper {

    <T extends MsgSendConfig> void sendSysMsg(String fromUserId, String toUserId, T msgSendConfig);

    <T extends MsgSendConfig> void sendSysMsgAsync(String fromUserId, String toUserId, T msgSendConfig);

    <T extends MsgSendConfig> void sendSysMsg(String fromUserId, String[] toUserIds, T msgSendConfig);

    <T extends MsgSendConfig> void sendSysMsgAsync(String fromUserId, String[] toUserIds, T msgSendConfig);

    <T extends MsgSendConfig> void sendSysMsg(String fromUserId, List<String> toUserIds, T msgSendConfig);

    <T extends MsgSendConfig> void sendSysMsgAsync(String fromUserId, List<String> toUserIds, T msgSendConfig);

}
