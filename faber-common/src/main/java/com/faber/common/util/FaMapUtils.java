package com.faber.common.util;

import cn.hutool.core.util.ObjectUtil;

import java.util.HashMap;
import java.util.Map;

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
