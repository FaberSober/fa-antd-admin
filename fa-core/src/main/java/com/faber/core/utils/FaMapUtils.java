package com.faber.core.utils;

import cn.hutool.core.util.ObjectUtil;

import java.util.HashMap;
import java.util.Map;

/**
 * Map帮助类
 * @author xu.pengfei
 * @date 2022/11/28 14:32
 */
public class FaMapUtils {

    public static Map<String, Object> removeEmptyValue(Map<String, Object> sourceMap) {
        Map<String, Object> resultMap = new HashMap<>();
        for (Map.Entry<String, Object> entry : sourceMap.entrySet()) {
            if (ObjectUtil.isNotEmpty(entry.getValue())) {
                resultMap.put(entry.getKey(), entry.getValue());
            }
        }
        return resultMap;
    }

}
