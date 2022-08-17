package com.faber.msg.helper.config;

import com.faber.msg.entity.Msg;
import lombok.Builder;
import lombok.Data;
import lombok.ToString;

/**
 * 短信模板配置
 */
@Data
@ToString
@PropKey(value = "SMD_CODE", smsEnable = true)
public class MsgSendSmsCode extends MsgSendConfig {

    /**
     * 短信验证码
     */
    private String code;

    @Builder
    public MsgSendSmsCode(boolean sendAppPush, boolean sendSms, String smsCode, int buzzType, String buzzId, String code) {
        super(true, true, smsCode, Msg.BuzzType.SMS_CODE.getValue(), buzzId);
        this.code = code;
    }
}
