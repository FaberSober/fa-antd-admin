package com.faber.msg.helper.config;

import com.faber.common.enums.admin.MsgBuzzTypeEnum;
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
        super(true, false, smsCode, MsgBuzzTypeEnum.SYS, buzzId);
        this.content = content;
    }
}
