package com.faber.core.file.impl;

import cn.hutool.core.date.DateUtil;
import com.faber.core.constant.FaSetting;
import com.faber.core.file.FileHelperImpl;
import com.faber.core.utils.FaFileUtils;
import com.faber.core.utils.file.QiniuHelper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.io.IOException;
import java.io.InputStream;

/**
 * 七牛云文件存储
 * @author xu.pengfei
 * @date 2022/11/28 14:20
 */
@Slf4j
@Service
@ConditionalOnProperty(name = "fa.setting.file.saveType", havingValue = "qiniu")
public class FileHelperQiniu implements FileHelperImpl {

    @Resource
    private FaSetting faSetting;

    @Resource
    private QiniuHelper qiniuHelper;

    @Override
    public String upload(InputStream is, String dir, String fileName) throws IOException {
        String path = faSetting.getFile().getPrefix() + "/" + dir + "/" + DateUtil.today() + "/" + FaFileUtils.addTimestampToFileName(fileName);
        return qiniuHelper.upload(is, path);
    }

    @Override
    public void delete(String filePath) throws IOException {
        qiniuHelper.delete(filePath);
    }
}
