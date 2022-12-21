package com.faber.core.file;

import cn.hutool.extra.spring.SpringUtil;
import com.faber.core.constant.FaSetting;
import com.faber.core.enums.FileSaveDriveEnum;
import com.faber.core.exception.BuzzException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;

/**
 * 文件保存帮助类
 * @author xu.pengfei
 * @date 2022/11/28 14:20
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
     * @param file 文件
     * @return
     */
    default String upload(MultipartFile file, String dir) throws IOException {
        return this.upload(file.getInputStream(), dir, file.getOriginalFilename());
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
     * @throws IOException
     */
    String upload(InputStream is, String dir, String fileName) throws IOException;

    void delete(String filePath) throws IOException;

    /**
     * 获取当前配置的文件存储类型
     * @return {@link FileSaveDriveEnum}
     */
    default FileSaveDriveEnum getDrive() {
        FaSetting faSetting = SpringUtil.getBean(FaSetting.class);
        switch (faSetting.getFile().getSaveType()) {
            case "local":
                return FileSaveDriveEnum.LOCAL;
            case "qiniu":
                return FileSaveDriveEnum.QINIU;
            case "ali":
                return FileSaveDriveEnum.ALI;
            case "tx":
                return FileSaveDriveEnum.TX;
            default:
                throw new BuzzException("配置文件中未指定文件存储类型");
        }
    }

}
