package com.faber.base.file;

import com.faber.common.file.FileHelperImpl;
import org.junit.Test;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public abstract class FileSaveTestBase {

    protected abstract FileHelperImpl getFileHelper();

    public void testUpload() throws IOException {
        File file = new File("/Users/xupengfei/Downloads/tmp/logo.png");
        String url = getFileHelper().upload(new FileInputStream(file), file.getName());
        System.out.println(url);
    }

    public void testDelete() throws IOException {
        File file = new File("/Users/xupengfei/Downloads/tmp/logo.png");
        String url = getFileHelper().upload(new FileInputStream(file), file.getName());
        System.out.println(url);

        getFileHelper().delete(url);
    }

}
