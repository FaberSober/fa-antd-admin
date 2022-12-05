package com.faber.api.msg.helper.config;

import com.faber.api.admin.enums.MsgBuzzTypeEnum;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;


@Data
@ToString
@NoArgsConstructor
@AllArgsConstructor
public class MsgSendConfig {

    /**
     * 是否推送APP消息
     */
    protected boolean sendAppPush = true;

    /**
     * 是否推送短信
     */
    protected boolean sendSms = true;

    /**
     * 短信编码
     */
    protected String smsCode;

    protected MsgBuzzTypeEnum buzzType;

    protected String buzzId;

}
