package com.faber.common.constant;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "system.setting")
public class SystemSetting {

    private File file;
    private Amap amap;

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
