package com.faber.core.utils;

import com.alibaba.fastjson2.JSON;
import lombok.extern.slf4j.Slf4j;

/**
 * @Author test
 * @Date 2025/8/14 15:44
 */
@Slf4j
public class FaJsonUtils {

    /**
     * 将 JSON 数组字符串转换为 Java 数组
     * @param jsonArrayStr JSON 数组字符串，例如 ["a","b","c"]
     * @param clazz        数组元素的类型，如 String.class, Integer.class
     * @param <T>          元素类型
     * @return Java 数组
     */
    public static <T> T[] toArraySafe(String jsonArrayStr, Class<T> clazz) {
        if (jsonArrayStr == null || jsonArrayStr.isEmpty()) {
            return (T[]) java.lang.reflect.Array.newInstance(clazz, 0);
        }
        try {
            return JSON.parseArray(jsonArrayStr, clazz).toArray((T[]) java.lang.reflect.Array.newInstance(clazz, 0));
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        return (T[]) java.lang.reflect.Array.newInstance(clazz, 0);
    }

}
