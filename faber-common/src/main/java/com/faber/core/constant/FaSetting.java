package com.faber.core.constant;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "fa.setting")
public class FaSetting {

    private Jwt jwt;
    private File file;
    private Qiniu qiniu;
    private Amap amap;

    /**
     * JWT配置
     */
    @Data
    public static class Jwt {
        private String tokenHeader;
        /**
         * token失效时间(单位秒)，24小时
         */
        private Long expire;
        private String secret;
    }

    /**
     * 文件配置
     */
    @Data
    public static class File {
        /**
         * 系统文件存储方式: local-本地存储/qiniu-七牛云/ali-阿里云/tx-腾讯云
         */
        private String saveType;
        /**
         * 增加一层最前置路径，可以用于区分不同环境
         */
        private String prefix;
    }

    /**
     * 七牛云
     */
    @Data
    public static class Qiniu {
        private String accessKey;
        private String secretKey;
        private String bucket;
        private String host;
    }

    /**
     * 高德地图配置
     */
    @Data
    public static class Amap {
        /**
         * key
         */
        private String key;
    }
}
