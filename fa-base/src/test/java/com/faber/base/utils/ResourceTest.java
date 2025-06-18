package com.faber.base.utils;

import cn.hutool.core.io.FileUtil;
import cn.hutool.json.JSONObject;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;

@Slf4j
public class ResourceTest {

    public void testJarSameDirFileExist(String filePath) throws IOException {
        File path = new File(ResourceUtils.getURL("classpath:").getPath());
        if (!path.exists()) path = new java.io.File("");
        File file = new File(path.getAbsolutePath(), filePath);
        log.info("{} exists={}", filePath, file.exists());
    }

    /**
     * 测试获取jar部署相同路径下的文件。如/static/upload/xxx.png。适用于jar部署后，获取web上传的文件。
     */
    @Test
    public void getJarSameDirFile() throws IOException  {
        testJarSameDirFileExist("/static/upload/xxx.png");
        testJarSameDirFileExist("/sql/updateLog.json");
    }

    /**
     * 获取jar打包内部的资源文件。
     * @throws IOException
     */
    @Test
    public void getResourceFile() throws IOException {
        File file = ResourceUtils.getFile("classpath:data/updateLog.json");
        System.out.println(file.exists());
        String fileStr = FileUtil.readString(file, StandardCharsets.UTF_8);
        JSONObject json = new JSONObject(fileStr);
        System.out.println(json);
    }

}
