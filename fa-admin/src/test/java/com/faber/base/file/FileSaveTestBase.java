package com.faber.base.file;

import com.faber.core.file.FileHelperImpl;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public abstract class FileSaveTestBase {

    protected abstract FileHelperImpl getFileHelper();

    public String upload() throws IOException {
        File file = new File("/Users/xupengfei/Downloads/tmp/logo.png");
        String url = getFileHelper().upload(new FileInputStream(file), "file/test", file.getName());
        System.out.println(url);
        return url;
    }

    public void testUpload() throws IOException {
        this.upload();
    }

    public void testDelete() throws IOException {
        String url = this.upload();

        getFileHelper().delete(url);
    }

}
