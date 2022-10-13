package com.faber.common.file;

import org.springframework.web.multipart.MultipartFile;

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
    default String upload(MultipartFile file) throws IOException {
        return this.upload(file.getInputStream(), file.getOriginalFilename());
    }

    /**
     * 保存文件
     * @param is 文件
     * @param fileName 文件名
     * @return
     */
    default String upload(InputStream is, String fileName) throws IOException {
        return this.upload(is, "file", fileName);
    }

    /**
     * 保存文件
     * @param is 文件
     * @param dir 路径名称，默认：file
     * @param fileName 文件名
     * @return
     */
    String upload(InputStream is, String dir, String fileName) throws IOException;

    void delete(String filePath) throws IOException;

}
