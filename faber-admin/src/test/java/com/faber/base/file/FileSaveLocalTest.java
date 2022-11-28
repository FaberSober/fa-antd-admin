package com.faber.base.file;

import com.faber.AdminBootstrap;
import com.faber.core.file.FileHelperImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.io.IOException;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, properties = {"fa.setting.file.saveType=local"}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FileSaveLocalTest extends FileSaveTestBase {

    @Resource
    private FileHelperImpl fileHelper;

    @Override
    protected FileHelperImpl getFileHelper() {
        return this.fileHelper;
    }

    @Test
    public void testUpload() throws IOException {
        super.testUpload();
    }

    @Test
    public void testDelete() throws IOException {
        super.testDelete();
    }

}
