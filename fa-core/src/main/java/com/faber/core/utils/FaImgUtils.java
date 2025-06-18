package com.faber.core.utils;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.util.StrUtil;

import java.io.File;
import java.util.Base64;

public class FaImgUtils {

    /**
     * base64 to png
     * @param base64
     * @return
     */
    public static File base64ToPng(String base64) {
        if (StrUtil.isEmpty(base64)) {
            throw new IllegalArgumentException("base64 is empty");
        }
        String str = base64;
        if (base64.contains("base64,")) {
            str = base64.substring(base64.indexOf("base64,") + 7);
        }

        File file = FileUtil.createTempFile(".png", true);
        // decode base64 str
        byte[] imageBytes = Base64.getDecoder().decode(str);

        // write to file
        FileUtil.writeBytes(imageBytes, file);
        return file;
    }

}
