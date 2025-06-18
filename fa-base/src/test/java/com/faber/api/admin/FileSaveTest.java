package com.faber.api.admin;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.date.DateUtil;
import cn.hutool.core.io.file.FileNameUtil;
import cn.hutool.crypto.digest.DigestUtil;
import org.dromara.x.file.storage.core.FileInfo;
import org.dromara.x.file.storage.core.FileStorageService;
import org.dromara.x.file.storage.core.UploadPretreatment;
import com.faber.FaTestApp;
import com.faber.api.base.admin.biz.FileSaveBiz;
import com.faber.api.base.admin.entity.FileSave;
import com.faber.core.service.ConfigSysService;
import com.faber.core.utils.FaFileUtils;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;


import jakarta.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.util.List;

/**
 * @author Farando
 * @date 2023/1/15 18:18
 * @description
 */
@Slf4j
@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {FaTestApp.class}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FileSaveTest {

    @Resource
    FileSaveBiz fileSaveBiz;

    @Autowired
    ConfigSysService configSysService;

    @Autowired
    private FileStorageService fileStorageService;

    @Test
    public void syncOldFiles() throws IOException {
        String storeDirPath = configSysService.getStoreLocalPath();

        List<FileSave> list = fileSaveBiz.list();
        for (FileSave fileSave : list) {
            String fileId = fileSave.getId();
            log.debug("file id: {}", fileId);
            String oldFilePath = storeDirPath + fileSave.getUrl();
            File file = new File(oldFilePath);

            if (!file.exists()) continue;

            UploadPretreatment uploadPretreatment = fileStorageService.of(file);

            String extName = FileNameUtil.extName(file.getName());
            if (FaFileUtils.isImg(extName)) {
                uploadPretreatment = uploadPretreatment.thumbnail(200, 200);
            }

            FileInfo fileInfo = uploadPretreatment
                    .setPath(DateUtil.today() + "/")
                    .setSaveFilename(file.getName())
                    .upload();

            BeanUtil.copyProperties(fileInfo, fileSave);
            fileSave.setId(fileId);

            String md5 = DigestUtil.md5Hex(file);
            fileSave.setMd5(md5);

            fileSaveBiz.updateById(fileSave);
        }
    }

}
