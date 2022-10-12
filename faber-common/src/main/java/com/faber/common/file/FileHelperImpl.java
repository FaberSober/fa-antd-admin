package com.faber.common.file;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

/**
 * 文件保存帮助类
 */
public interface FileHelperImpl {

    /**
     * 保存文件
     * @param file 文件
     * @return
     */
    String upload(MultipartFile file) throws IOException;

    /**
     * 保存文件
     * @param is 文件
     * @param fileName 存储路径
     * @return
     */
    String upload(InputStream is, String fileName) throws IOException;

    void delete(String filePath) throws IOException;

}
