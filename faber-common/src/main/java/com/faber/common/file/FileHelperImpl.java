package com.faber.common.file;

import java.io.File;

/**
 * 文件保存帮助类
 */
public interface FileHelperImpl {

    /**
     * 保存文件
     * @param file 文件
     * @param path 存储路径
     * @return
     */
    String upload(File file, String path);

}
