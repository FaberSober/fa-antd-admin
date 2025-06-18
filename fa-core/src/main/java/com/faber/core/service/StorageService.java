package com.faber.core.service;

import org.dromara.x.file.storage.core.FileInfo;

import java.io.File;

/**
 * 存储配置
 * @author Farando
 * @date 2023/1/13 21:58
 * @description
 */
public interface StorageService {

    /**
     * 同步内部的文件存储配置信息
     */
    void syncStorageDatabaseConfig();

    /**
     * 通过文件ID获取文件对象
     * @param fileId 文件ID
     * @return 文件对象File
     */
    File getByFileId(String fileId);

    FileInfo getFileInfoById(String fileId);

    /**
     * 保存业务关联
     */
    void saveFileBiz(String mainBizId, String bizId, String type, String fileId);

}
