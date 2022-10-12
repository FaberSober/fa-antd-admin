package com.faber.base.file;

import com.faber.AdminBootstrap;
import com.faber.common.file.FileHelperImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = {AdminBootstrap.class}, properties = {"system.setting.file.saveType=local"}, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class FileSaveLocalTest {

    @Resource
    private FileHelperImpl fileHelper;

    @Test
    public void testUpload() throws IOException {
        File file = new File("/Users/xupengfei/Downloads/tmp/logo.png");
        String url = fileHelper.upload(new FileInputStream(file), file.getName());
        System.out.println(url);
    }

    @Test
    public void testDelete() throws IOException {
        File file = new File("/Users/xupengfei/Downloads/tmp/logo.png");
        String url = fileHelper.upload(new FileInputStream(file), file.getName());
        System.out.println(url);

        fileHelper.delete(url);
    }

}
