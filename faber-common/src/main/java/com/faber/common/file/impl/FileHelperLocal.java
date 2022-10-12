package com.faber.common.file.impl;

import com.faber.common.file.FileHelperImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.io.File;

@Slf4j
@Service
@ConditionalOnProperty(name = "default.setting.file.saveType", havingValue = "local")
public class FileHelperLocal implements FileHelperImpl {

    @Override
    public String upload(File file, String path) {
        log.debug("FileHelperLocal");
        return null;
    }

}
