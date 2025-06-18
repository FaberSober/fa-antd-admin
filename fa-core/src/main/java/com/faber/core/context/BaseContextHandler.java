package com.faber.core.context;

import com.faber.core.constant.CommonConstants;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * 上下文内容存储，当前线程本地存储
 */
public class BaseContextHandler {

    /** 当前线程本地存储，主要用于存储当前接口操作线程的用户信息 */
    public static ThreadLocal<Map<String, Object>> threadLocal = new ThreadLocal<Map<String, Object>>();

    public static void set(String key, Object value) {
        Map<String, Object> map = threadLocal.get();
        if (map == null) {
            map = new HashMap<String, Object>();
            threadLocal.set(map);
        }
        map.put(key, value);
    }

    public static Object get(String key) {
        Map<String, Object> map = threadLocal.get();
        if (map == null) {
            map = new HashMap<String, Object>();
            threadLocal.set(map);
        }
        return map.get(key);
    }

    public static String getUserId() {
        Object value = get(CommonConstants.CONTEXT_KEY_USER_ID);
        return returnObjectValue(value);
    }

    public static String getUsername() {
        Object value = get(CommonConstants.CONTEXT_KEY_USERNAME);
        return returnObjectValue(value);
    }


    public static String getName() {
        return (String) get(CommonConstants.CONTEXT_KEY_USER_NAME);
    }

    public static String getToken() {
        return (String) get(CommonConstants.CONTEXT_KEY_USER_TOKEN);
    }

    public static String getIp() {
        return (String) get(CommonConstants.CONTEXT_KEY_USER_IP);
    }

    public static Boolean getLogin() {
        Object value = get(CommonConstants.CONTEXT_KEY_LOGIN);
        return value != null && (Boolean) value;
    }

    public static void setLogin(Boolean login) {
        set(CommonConstants.CONTEXT_KEY_LOGIN, login);
    }

    public static void setToken(String token) {
        set(CommonConstants.CONTEXT_KEY_USER_TOKEN, token);
    }

    public static void setName(String name) {
        set(CommonConstants.CONTEXT_KEY_USER_NAME, name);
    }

    public static void setUserId(String userId) {
        set(CommonConstants.CONTEXT_KEY_USER_ID, userId);
    }

    public static void setUsername(String username) {
        set(CommonConstants.CONTEXT_KEY_USERNAME, username);
    }

    public static void setUserIp(String ip) {
        set(CommonConstants.CONTEXT_KEY_USER_IP, ip);
    }

    // ----------------------------------------- MybatisPlus分表 -----------------------------------------
    public static String getTableSuffix() {
        return (String) get(CommonConstants.CONTEXT_KEY_TABLE_SUFFIX);
    }

    public static void setTableSuffix(String tableSuffix) {
        set(CommonConstants.CONTEXT_KEY_TABLE_SUFFIX, tableSuffix);
    }

    // ----------------------------------------- 日志备注 -----------------------------------------
    public static void setLogRemark(String remark) {
        set(CommonConstants.CONTEXT_KEY_LOG_REMARK, remark);
    }

    public static String getLogRemark() {
        return (String) get(CommonConstants.CONTEXT_KEY_LOG_REMARK);
    }

    public static void setLogOprRemark(String remark) {
        set(CommonConstants.CONTEXT_KEY_LOG_OPR_REMARK, remark);
    }

    public static String getLogOprRemark() {
        return (String) get(CommonConstants.CONTEXT_KEY_LOG_OPR_REMARK);
    }

    private static String returnObjectValue(Object value) {
        return value == null ? null : value.toString();
    }

    // ----------------------------------------- 线程缓存 -----------------------------------------
    public static <T> Map<Serializable, T> getCacheMap(Class<T> clazz) {
        String key = clazz.getName();
        Object obj = get(key);
        if (obj == null) {
            set(key, new HashMap<Serializable, T>());
        }
        Map<Serializable, T> map = (Map<Serializable, T>) get(key);
        return map;
    }

    public static <T> Map<Serializable, T> getCacheMap(String key) {
        Object obj = get(key);
        if (obj == null) {
            set(key, new HashMap<Serializable, T>());
        }
        Map<Serializable, T> map = (Map<Serializable, T>) get(key);
        return map;
    }
    // ----------------------------------------- 线程缓存 -----------------------------------------

    public static void remove() {
        threadLocal.remove();
    }

    /**
     * 代码设置-使用admin作为当前线程的用户-一般用于未登录的系统线程操作
     */
    public static void useAdmin() {
        BaseContextHandler.setUserId("1");
        BaseContextHandler.setName("Admin");
        BaseContextHandler.setUsername("超级管理员");
        BaseContextHandler.setLogin(true);
    }

    public static Map<String, Object> getHoldMap() {
        return threadLocal.get();
    }

    public static void setHoldMap(Map<String, Object> holdMap) {
        threadLocal.set(holdMap);
    }

}
