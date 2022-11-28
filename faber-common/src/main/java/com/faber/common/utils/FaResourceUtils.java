package com.faber.common.utils;

import cn.hutool.core.io.FileUtil;
import cn.hutool.json.JSONObject;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Spring Resource Helper Class
 * @author xu.pengfei
 * @date 2022/11/28 14:32
 */
public class FaResourceUtils {

    /**
     * 读取jar打包内部的资源文件。
     * @param resourceLocation 如："classpath:data/updateLog.json"
     * @return 返回文件字符串
     * @throws IOException
     */
    public static String getResourceString(String resourceLocation) throws IOException  {
        File file = ResourceUtils.getFile(resourceLocation);
        return FileUtil.readString(file, StandardCharsets.UTF_8);
    }

    /**
     * 读取jar打包内部的资源文件。
     * @param resourceLocation 如："classpath:data/updateLog.json"
     * @return 返回文件JSONObject
     * @throws IOException
     */
    public static JSONObject getResourceJson(String resourceLocation) throws IOException {
        String fileStr = getResourceString(resourceLocation);
        return new JSONObject(fileStr);
    }

}
