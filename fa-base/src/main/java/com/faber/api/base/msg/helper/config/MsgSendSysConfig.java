package com.faber.api.base.msg.helper.config;

import com.faber.api.base.msg.enums.MsgBuzzTypeEnum;
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
    public MsgSendSysConfig(boolean sendAppPush, boolean sendSms, String buzzId, String content) {
        super(true, false, MsgBuzzTypeEnum.SYS.getValue() + "", buzzId);
        this.content = content;
    }
}
