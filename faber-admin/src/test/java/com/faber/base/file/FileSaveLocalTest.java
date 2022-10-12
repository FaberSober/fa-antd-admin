package com.faber.base.file;

import cn.hutool.core.io.FileUtil;
import com.faber.AdminBootstrap;
import com.faber.common.file.FileHelperImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.io.File;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, properties = {"system.setting.file.saveType=local"}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FileSaveLocalTest {

    @Resource
    private FileHelperImpl fileHelper;

    @Test
    public void testUpload() {
        File file = FileUtil.createTempFile();
        fileHelper.upload(file, "file");
    }

}
