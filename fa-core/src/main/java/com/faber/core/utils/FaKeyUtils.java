package com.faber.core.utils;

import cn.hutool.core.lang.UUID;

/**
 * @author Farando
 * @date 2023/3/6 16:04
 * @description
 */
public class FaKeyUtils {

    public static String getTokenKey(String token) {
        return "login:token:" + token;
    }

    public static String getRefreshTokenKey(String token) {
        return "login:refresh:token:" + token;
    }

    public static String genUUID() {
        return UUID.fastUUID().toString(true);
    }

}
