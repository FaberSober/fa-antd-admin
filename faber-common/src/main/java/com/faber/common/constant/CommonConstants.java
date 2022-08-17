package com.faber.common.constant;

/**
 * 系统常用常量
 */
public class CommonConstants {

    /** 权限资源类型 */
    public final static String RESOURCE_TYPE_MENU = "menu";
    public final static String RESOURCE_TYPE_BTN = "button";

    // ---------------- 用户token异常 ----------------
    public static final Integer EX_USER_INVALID_CODE = 40101;
    public static final Integer EX_USER_PASS_INVALID_CODE = 40001;

    // ---------------- 用户无权访问 ----------------
    public static final Integer EX_USER_NO_PERMISSION = 40301;

    // ---------------- 其他异常 ----------------
    public static final Integer EX_OTHER_CODE = 500;

    public static final String CONTEXT_KEY_USER_ID = "currentUserId";
    public static final String CONTEXT_KEY_USERNAME = "currentUserName";
    public static final String CONTEXT_KEY_PHONE = "currentPhone";
    public static final String CONTEXT_KEY_USER_NAME = "currentUser";
    public static final String CONTEXT_KEY_USER_TOKEN = "currentUserToken";

    public static final String JWT_KEY_USER_ID = "userId";
    public static final String JWT_KEY_NAME = "name";

    public final static int ROOT = -1;
    public final static int DEFAULT_GROUP_TYPE = 0;

    /** 权限关联类型 */
    public final static String AUTHORITY_TYPE_GROUP = "group";

    public final static String RESOURCE_REQUEST_METHOD_GET = "GET";
    public final static String RESOURCE_REQUEST_METHOD_PUT = "PUT";
    public final static String RESOURCE_REQUEST_METHOD_DELETE = "DELETE";
    public final static String RESOURCE_REQUEST_METHOD_POST = "POST";

    public final static String RESOURCE_ACTION_VISIT = "访问";

    public final static String BOOLEAN_NUMBER_FALSE = "0";
    public final static String BOOLEAN_NUMBER_TRUE = "1";
}
