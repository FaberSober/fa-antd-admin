package com.faber.base.utils;

import cn.hutool.core.util.ZipUtil;
import org.junit.jupiter.api.Test;

import java.io.File;
import java.nio.file.StandardCopyOption;

public class ZipTest {

    @Test
    public void testZip() {
//        File srcFile = new File("/Users/xupengfei/Downloads/tmp2/test.pdf");
//        File srcFile2 = new File("/Users/xupengfei/Downloads/tmp2/test2.pdf");
        File srcDir = new File("/Users/xupengfei/Downloads/tmp2/workout");
        File zipFile = ZipUtil.zip(srcDir);

//        ZipUtil.append(zipFile.toPath(), srcFile2.toPath(), StandardCopyOption.REPLACE_EXISTING);
//        ZipUtil.append(zipFile.toPath(), srcDir.toPath(), StandardCopyOption.REPLACE_EXISTING);
    }

}
