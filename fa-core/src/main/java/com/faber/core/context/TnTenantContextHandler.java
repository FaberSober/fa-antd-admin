package com.faber.core.context;

import com.faber.core.constant.CommonConstants;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * 上下文内容存储，当前线程本地存储
 */
public class TnTenantContextHandler {

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

    public static void setLogin(Boolean login) {
        set(CommonConstants.CONTEXT_KEY_TENANT_LOGIN, login);
    }

    public static Boolean getLogin() {
        Object value = get(CommonConstants.CONTEXT_KEY_TENANT_LOGIN);
        return value != null && (Boolean) value;
    }

    public static void setUserId(Long userId) {
        set(CommonConstants.CONTEXT_KEY_USER_ID, userId);
    }

    public static Long getUserId() {
        return (Long) get(CommonConstants.CONTEXT_KEY_USER_ID);
    }

    public static void setName(String name) {
        set(CommonConstants.CONTEXT_KEY_USER_NAME, name);
    }

    public static String getName() {
        return (String) get(CommonConstants.CONTEXT_KEY_USER_NAME);
    }

    public static void setIp(String ip) {
        set(CommonConstants.CONTEXT_KEY_USER_IP, ip);
    }

    public static String getIp() {
        return (String) get(CommonConstants.CONTEXT_KEY_USER_IP);
    }

    public static void setTenantId(Long tenantId) {
        set(CommonConstants.CONTEXT_KEY_TENANT_ID, tenantId);
    }

    public static Long getTenantId() {
        return (Long) get(CommonConstants.CONTEXT_KEY_TENANT_ID);
    }

    public static void setTenantName(String tenantName) {
        set(CommonConstants.CONTEXT_KEY_TENANT_NAME, tenantName);
    }

    public static String getTenantName() {
        return (String) get(CommonConstants.CONTEXT_KEY_TENANT_NAME);
    }

    public static void setCorpId(Long corpId) {
        set(CommonConstants.CONTEXT_KEY_CORP_ID, corpId);
    }

    public static Long getCorpId() {
        return (Long) get(CommonConstants.CONTEXT_KEY_CORP_ID);
    }

    public static void setCorpName(String corpName) {
        set(CommonConstants.CONTEXT_KEY_CORP_NAME, corpName);
    }

    public static String getCorpName() {
        return (String) get(CommonConstants.CONTEXT_KEY_CORP_NAME);
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
    // ----------------------------------------- 线程缓存 -----------------------------------------

    public static void remove() {
        threadLocal.remove();
    }

    /**
     * 代码确认使用admin作为当前线程的用户
     */
    public static void useAdmin() {
        TnTenantContextHandler.setUserId(1L);
        TnTenantContextHandler.setName("Admin");
        TnTenantContextHandler.setTenantName("默认厂商");
        TnTenantContextHandler.setTenantId(1L);
        TnTenantContextHandler.setLogin(true);
    }

}
