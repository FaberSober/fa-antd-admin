package com.faber.msg.helper;

import com.faber.msg.helper.config.MsgSendConfig;

public interface MsgHelper {

    void sendSysMsg(String fromUserId, String toUserId, MsgSendConfig msgSendConfig);

    void sendSysMsg(String fromUserId, String[] toUserIds, MsgSendConfig msgSendConfig);

}
