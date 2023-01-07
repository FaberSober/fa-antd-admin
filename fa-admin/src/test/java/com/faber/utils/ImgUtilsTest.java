package com.faber.utils;

import cn.hutool.core.img.ImgUtil;
import cn.hutool.core.io.FileUtil;
import org.junit.Test;

import java.awt.*;

public class ImgUtilsTest {

//    private static final String FILE_BIG_IMG = "C:\\Users\\Farando\\Pictures\\big_img.jpg";
//    private static final String FILE_BIG_IMG_SCALE = "C:\\Users\\Farando\\Pictures\\big_img_scale.jpg";

    private static final String FILE_BIG_IMG = "/Users/xupengfei/Downloads/level1.gif";
    private static final String FILE_BIG_IMG_SCALE = "/Users/xupengfei/Downloads/level1_scale.gif";

    @Test
    public void testSizeImg() {
        ImgUtil.scale(
                FileUtil.file(FILE_BIG_IMG),
                FileUtil.file(FILE_BIG_IMG_SCALE),
                200, 200,
                Color.WHITE
                );

//        ImgUtil.slice(FileUtil.file(FILE_BIG_IMG), FileUtil.file(FILE_BIG_IMG_SCALE), 1000, 1000);
    }

}
