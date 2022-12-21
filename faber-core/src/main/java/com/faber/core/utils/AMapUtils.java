package com.faber.core.utils;

import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import lombok.extern.java.Log;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

/**
 * 高德地图定位
 */
@Log
@Component
public class AMapUtils {

    @Value("${fa.setting.amap.key}")
    private String key;

    public static final String API_GET_LOC_BY_IP = "http://restapi.amap.com/v3/ip?key=%1$s&ip=%2$s";

    public Map<String, Object> getLocByIp(String ip) {
        String restApi = String.format(API_GET_LOC_BY_IP, key, ip);
        String result = HttpUtil.get(restApi);
        JSONObject json = JSONUtil.parseObj(result);
        Map<String, Object> map = new HashMap<>();
        for (String key : json.keySet()) {
            map.put(key, json.get(key));
        }
        return map;
    }

}
