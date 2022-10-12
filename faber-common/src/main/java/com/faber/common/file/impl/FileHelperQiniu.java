package com.faber.common.file.impl;

import cn.hutool.core.date.DateUtil;
import com.faber.common.constant.SystemSetting;
import com.faber.common.file.FileHelperImpl;
import com.faber.common.util.FaFileUtils;
import com.faber.common.util.file.QiniuHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;

@Slf4j
@Service
@ConditionalOnProperty(name = "system.setting.file.saveType", havingValue = "qiniu")
public class FileHelperQiniu implements FileHelperImpl {

    @Resource
    private SystemSetting systemSetting;

    @Resource
    private QiniuHelper qiniuHelper;

    @Override
    public String upload(InputStream is, String fileName) throws IOException {
        String path = systemSetting.getFile().getPrefix() + "/file/" + DateUtil.today() + "/" + FaFileUtils.addTimestampToFileName(fileName);
        return qiniuHelper.upload(is, path);
    }

    @Override
    public void delete(String filePath) throws IOException {
        qiniuHelper.delete(filePath);
    }
}
