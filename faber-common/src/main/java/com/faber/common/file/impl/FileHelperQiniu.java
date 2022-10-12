package com.faber.common.file.impl;

import com.faber.common.file.FileHelperImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.File;

@Slf4j
@Service
@ConditionalOnProperty(name = "system.setting.file.saveType", havingValue = "qiniu")
public class FileHelperQiniu implements FileHelperImpl {

    @Override
    public String upload(File file, String path) {
        log.debug("FileHelperQiniu");
        return null;
    }

    @Override
    public void delete(String filePath) {

    }

}
