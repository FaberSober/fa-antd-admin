package com.faber.api.base.admin.cache.constant;

import java.util.concurrent.TimeUnit;

/**
 * Redis缓存常量工具类
 * 统一管理缓存Key前缀和过期时间
 * @author renjinyi
 */
public class RedisCacheConstant {

    // ========================= 库存预警相关缓存 =========================
    /** 原材料库存不足预警缓存Key前缀 */
    public static final String INVENTORY_ALERT_KEY_PREFIX = "inventory:alert:";

    /** 库存预警缓存默认过期时间 */
    public static final long INVENTORY_ALERT_EXPIRE = 365;

    /** 库存预警缓存过期时间单位 */
    public static final TimeUnit INVENTORY_ALERT_EXPIRE_UNIT = TimeUnit.DAYS;


}