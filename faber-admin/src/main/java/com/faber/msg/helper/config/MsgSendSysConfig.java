package com.faber.msg.helper.config;

import com.faber.msg.entity.Msg;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

/**
 * 系统通知
 */
@Data
@ToString
@PropKey(value = "", smsEnable = false)
public class MsgSendSysConfig extends MsgSendConfig {

    private String content;

    @Builder
    public MsgSendSysConfig(boolean sendAppPush, boolean sendSms, String smsCode, String buzzId, String content) {
        super(true, false, smsCode, Msg.BuzzType.SYS.getValue(), buzzId);
        this.content = content;
    }
}
