package com.faber.core.constant;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.StrUtil;
import com.faber.core.enums.ConfigSysStorageActiveEnum;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Data
@Component
@ConfigurationProperties(prefix = "fa.setting")
public class FaSetting {

    private Jwt jwt;
    private Api api;
    private App app;
    private File file;
    private Qiniu qiniu;
    private Amap amap;
    private Url url;
    private Config config;
    private Onlyoffice onlyoffice;
    private ThreadPoolConfig threadPoolConfig;
    private Db db;
    private Safety safety;

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
     * Api配置
     */
    @Data
    public static class Api {
        private String tokenApiHeader;
    }

    /**
     * APP配置
     */
    @Data
    public static class App {
        /**
         * 设备首次注册后是否允许访问
         */
        private boolean deviceDefaultAllow = true;
    }

    /**
     * 文件配置
     */
    @Data
    public static class File {
        /**
         * 系统文件存储方式: local-本地存储/local-plus-本地存储/qiniu-七牛云/ali-阿里云/tx-腾讯云
         */
        private String saveType;
        /**
         * x-file-storage存储的平台
         */
        private String savePlatform;
        /**
         * 增加一层最前置路径，可以用于区分不同环境
         */
        private String prefix;
        /**
         * 增加一层最前置路径，可以用于区分不同环境
         */
        private String allowFiles;

        private List<String> allowFileList;

        public boolean isFileAllowed(String fileName) {
            if (StrUtil.isEmpty(this.allowFiles)) {
                return true;
            }

            if (this.allowFileList == null) {
                this.allowFileList = Arrays.asList(this.allowFiles.split(","));
            }

            String ext = FileUtil.extName(fileName);
            return this.allowFileList.contains(ext);
        }

        public void updateSaveType(ConfigSysStorageActiveEnum storageActive) {
            this.saveType = storageActive.getValue();
            this.savePlatform = storageActive.getDesc();
        }
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

    /**
     * 系统设置
     */
    @Data
    public static class Config {
        /**
         * 系统启动时执行数据库初始化脚本
         */
        private Boolean startDbInitOnBoot = true;
        /**
         * 系统启动时扫描任务class并启动
         */
        private Boolean startJobsOnBoot = true;
        /**
         * 系统是否在离线内网环境下运行
         */
        private Boolean offline = false;
    }

    /**
     * Url
     */
    @Data
    public static class Url {
        /**
         * phpRedisAdmin
         */
        private String phpRedisAdmin;
        /**
         * socketUrl
         */
        private String socketUrl;
        /**
         * kkFileView
         */
        private String kkFileView;
        /**
         * 本服务用于外网访问的域名
         */
        private String serverHost;
    }

    /**
     * Onlyoffice
     */
    @Data
    public static class Onlyoffice {
        /**
         * ONLYOFFICE_SERVER，返回给前端获取api
         */
        private String onlyofficeServer;
        /**
         * 本服务提供给onlyoffice回调的服务器地址
         */
        private String callbackServer;
        /**
         * docservice中配置jwt secret
         */
        private String docserviceSecret;
        /**
         * docservice中配置token的Header Key
         */
        private String docserviceHeader;
        private String fileFillformsDocs;
        private String fileViewedDocs;
        private String fileEditedDocs;
        private String fileConvertDocs;
    }

    /**
     * ThreadPoolConfig{@link com.faber.core.config.thread.ThreadPoolConfig}
     */
    @Data
    public static class ThreadPoolConfig {
        /**
         * 线程池维护线程的最少数量
         */
        private int corePoolSize = 5;
        /**
         * 线程池维护线程的最大数量,只有在缓冲队列满了之后才会申请超过核心线程数的线程
         */
        private int maxPoolSize = 10;
        /**
         * 缓存队列
         */
        private int queueCapacity = 20;
        /**
         * 允许的空闲时间,当超过了核心线程出之外的线程在空闲时间到达之后会被销毁
         */
        private int keepAliveSeconds = 200;
        /**
         * 线程名称前缀
         */
        private String threadNamePrefix = "my-faber-thread-";
        /**
         * 调度器shutdown被调用时等待当前被调度的任务完成
         */
        private boolean waitForJobsToCompleteOnShutdown = true;
        /**
         * 等待时长
         */
        private int awaitTerminationSeconds = 60;
    }

    /**
     * 数据库配置
     */
    @Data
    public static class Db {
        /**
         * 支持分表的表名数组，在每次查询是需要指定{@link com.faber.core.context.BaseContextHandler#setTableSuffix(String)}方法来指定表名追加的后缀。
         */
        private List<String> multiTables = new ArrayList<>();
    }

    /**
     * 安全配置
     */
    @Data
    public static class Safety {
        /**
         * 是否校验URL、body的签名完整性
         */
        private boolean intact = false;
        /**
         * 和前端统一的签名密钥
         */
        private String secret;
    }

}
