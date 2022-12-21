package com.faber.api.base.msg.helper.properties;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;
import java.util.Map;

@Data
@ConfigurationProperties(prefix = "aliyun.sms")
public class SmsProperties {

    /**
     * 阿里云短信区域ID
     */
    private String regionId;
    /**
     * 阿里云ak
     */
    private String accessKeyId;
    /**
     * 阿里云sk
     */
    private String secret;
    /**
     * 阿里云短信签名
     */
    private String signName;

    /**
     * 短信模板配置
     */
    private Map<String, Config> smsConfig;

    @Data
    public static class Config {
        /**
         * 阿里云短信的模版CODE
         */
        private String smsCode;

        /**
         * 阿里云短信的模版内容
         */
        private String template;

        private List<String> keys;
    }

}
