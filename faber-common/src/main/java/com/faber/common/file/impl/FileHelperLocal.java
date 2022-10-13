package com.faber.common.file.impl;

import cn.hutool.core.date.DateUtil;
import com.faber.common.constant.SystemSetting;
import com.faber.common.file.FileHelperImpl;
import com.faber.common.util.FaFileUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FileUtils;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.util.ResourceUtils;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Service
@ConditionalOnProperty(name = "system.setting.file.saveType", havingValue = "local")
public class FileHelperLocal implements FileHelperImpl {

    @Resource
    private SystemSetting systemSetting;

    @Override
    public String upload(InputStream is, String dir, String fileName) throws IOException {
        String fileSavePath = getDirPath() + dir + "/" + DateUtil.today() + "/" + FaFileUtils.addTimestampToFileName(fileName);

        File exportFile = new File(getAbsolutePath(), fileSavePath);
        FileUtils.copyInputStreamToFile(is, exportFile);

        return fileSavePath;
    }

    @Override
    public void delete(String filePath) throws IOException {
        File file = new File(getAbsolutePath(), filePath);
        if (file.exists()) {
            file.delete();
        }
    }

    private String getAbsolutePath() throws IOException {
        return new File(ResourceUtils.getURL("classpath:").getPath()).getAbsolutePath();
    }

    /**
     * 获取文件存储路径
     * @return
     */
    private String getDirPath() {
        return "/static/" + systemSetting.getFile().getPrefix() + "/";
    }

}
