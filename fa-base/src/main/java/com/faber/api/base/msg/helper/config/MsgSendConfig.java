
package com.faber.api.base.msg.helper.config;

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

    protected String buzzType;

    protected String buzzId;

}
