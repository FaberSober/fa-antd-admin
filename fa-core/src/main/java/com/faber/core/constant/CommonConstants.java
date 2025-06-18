package com.faber.core.constant;

/**
 * 系统常用常量
 */
public class CommonConstants {

    // ---------------- 用户token异常 ----------------
    public static final Integer EX_USER_INVALID_CODE = 40101;
    public static final Integer EX_USER_INVALID_DEVICE_CODE = 40102;
    public static final Integer EX_USER_PASS_INVALID_CODE = 40001;

    // ---------------- 用户无权访问 ----------------
    public static final Integer EX_USER_NO_PERMISSION = 40301;

    // ---------------- 其他异常 ----------------
    public static final Integer EX_OTHER_CODE = 500;

    /** 密码盐 */
    public static int PW_ENCODER_SALT = 12;

    // ---------------- 上下文信息 ----------------
    public static final String CONTEXT_KEY_LOGIN = "currentLogin";
    public static final String CONTEXT_KEY_USER = "currentUser";
    public static final String CONTEXT_KEY_USER_ID = "currentUserId";
    public static final String CONTEXT_KEY_USERNAME = "currentUserName";
    public static final String CONTEXT_KEY_PHONE = "currentPhone";
    public static final String CONTEXT_KEY_USER_NAME = "currentUser";
    public static final String CONTEXT_KEY_USER_TOKEN = "currentUserToken";
    public static final String CONTEXT_KEY_USER_IP = "currentUserIp";
    public static final String CONTEXT_KEY_LOG_REMARK = "currentLogRemark"; // 当前请求的备注信息，自定义写入请求日志中，方便备注查看
    public static final String CONTEXT_KEY_LOG_OPR_REMARK = "currentLogOprRemark"; // 当前请求的操作信息，自定义写入请求日志中，方便备注查看

    /**
     * MyBatisPlus追加表的后缀，可以用作分表
     */
    public static final String CONTEXT_KEY_TABLE_SUFFIX = "currentTableSuffix";

    // ---------------- 上下文信息-租户特有字段 ----------------
    public static final String CONTEXT_KEY_TENANT_LOGIN = "currentTenantLogin";
    public static final String CONTEXT_KEY_TENANT_ID = "currentTenantIp"; // 当前租户所属的租户ID
    public static final String CONTEXT_KEY_TENANT_NAME = "currentTenantName"; // 当前租户所属的租户名称
    public static final String CONTEXT_KEY_CORP_ID = "currentCorpIp"; // 当前租户所属的企业ID
    public static final String CONTEXT_KEY_CORP_NAME = "currentCorpName"; // 当前租户所属的企业名称

    public static final String JWT_KEY_USER_ID = "userId";
    public static final String JWT_KEY_NAME = "name";

    // ---------------- Header自定义头 ----------------
    /**
     * 添加到请求的Header中，标识请求来源：FaWeb/FaApp。{@link FaFrom}
     */
    public static final String FA_FROM = "FaFrom";


    public static final class FaFrom {
        public static final String FaWeb = "FaWeb";
        public static final String FaApp = "FaApp";
    }

    /**
     * 添加到请求的Header中，标识客户端版本号
     */
    public static final String FA_VERSION_CODE = "FaVersionCode";

    /**
     * 添加到请求的Header中，标识客户端版本名
     */
    public static final String FA_VERSION_NAME = "FaVersionName";

    /**
     * 添加到请求的Header中，标识客户端APP的设备ID
     */
    public static final String FA_APP_DEVICE_ID = "FaAppDeviceId";

    /**
     * 租户-选中的企业ID
     */
    public static final String FA_TN_CORP_ID = "fa-tn-corp-id";

    // ---------------- Tree形数据根节点默认ID=0 ----------------
    public final static int ROOT = 0;

    /**
     * 单次分页查询返回数据最大值
     */
    public final static long QUERY_MAX_COUNT = 1000;

    /**
     * 中国地区编码-中国编码-6位
     */
    public final static int AREA_CODE_CHINA = 100000;

    /**
     * 中国地区编码-中国编码-6位
     */
    public final static long AREA_CODE_CHINA_12 = 100000000000L;

    // ---------------- 系统配置相关 ----------------
    /**
     * 用户注册的默认用户角色名称
     */
    public final static String REGISTRY_USER_ROLE_NAME = "默认用户角色";


    // ---------------- 系统配置相关 ----------------
    /**
     * 通用Excel导入忽略字段数组
     */
    public final static String[] BASIC_EXCEL_IGNORE_PROPS = new String[]{
            "deleted",
            "updTime", "updUser", "updName", "updHost",
            "crtTime", "crtUser", "crtName", "crtHost"};

}
