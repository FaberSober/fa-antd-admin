package com.faber.api.base.msg.helper;

import com.faber.api.base.msg.helper.config.MsgSendConfig;

public interface MsgHelper {

    <T extends MsgSendConfig> void sendSysMsg(String fromUserId, String toUserId, T msgSendConfig);

    <T extends MsgSendConfig> void sendSysMsg(String fromUserId, String[] toUserIds, T msgSendConfig);

}
