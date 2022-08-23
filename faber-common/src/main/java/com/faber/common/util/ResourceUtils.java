package com.faber.common.util;

import cn.hutool.core.io.FileUtil;
import cn.hutool.json.JSONObject;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

public class ResourceUtils {

    /**
     * 读取jar打包内部的资源文件。
     * @param resourceLocation 如："classpath:data/updateLog.json"
     * @return 返回文件字符串
     * @throws IOException
     */
    public static String getResourceString(String resourceLocation) throws IOException  {
        File file = org.springframework.util.ResourceUtils.getFile(resourceLocation);
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
