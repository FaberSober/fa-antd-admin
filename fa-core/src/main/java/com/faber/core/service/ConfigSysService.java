package com.faber.core.service;

import com.faber.core.utils.FaFileUtils;
import com.faber.core.vo.config.FaConfig;
import com.faber.core.vo.query.ConditionGroup;

import java.io.File;
import java.io.IOException;

/**
 * @author xupengfei
 * @description
 * @date 2022/11/28 10:56
 */
public interface ConfigSysService {

    /**
     * 获取本地文件存储路径
     * @return
     */
    default String getStoreLocalPath()  {
        try {
            return FaFileUtils.getAbsolutePath();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    FaConfig getConfig();

}
