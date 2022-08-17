package com.faber.msg.helper.config;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface PropKey {

    /**
     * 对应配置文件geo.sms.smsConfig
     */
    String value();

    /**
     * 是否支持短信发送
     */
    boolean smsEnable();

}
