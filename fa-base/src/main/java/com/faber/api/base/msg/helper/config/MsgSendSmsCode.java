package com.faber.api.base.msg.helper.config;

import com.faber.api.base.msg.enums.MsgBuzzTypeEnum;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

/**
 * 短信模板配置
 */
@Data
@ToString
@PropKey(value = "SMS_CODE", smsEnable = true)
public class MsgSendSmsCode extends MsgSendConfig {

    /**
     * 短信验证码
     */
    private String code;

    @Builder
    public MsgSendSmsCode(boolean sendAppPush, boolean sendSms, MsgBuzzTypeEnum buzzType, String buzzId, String code) {
        super(true, true, buzzType.getValue() + "", buzzId);
        this.code = code;
    }
}
