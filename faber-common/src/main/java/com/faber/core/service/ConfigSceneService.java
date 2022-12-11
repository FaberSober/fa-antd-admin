package com.faber.core.service;

import com.faber.core.vo.query.ConditionGroup;

/**
 * @author xupengfei
 * @description
 * @date 2022/11/28 10:56
 */
public interface ConfigSceneService {

    /**
     * TO-DO: 这个要改为结构化的Bean返回，返回String不利于代码理解
     * 根据配置ID返回配置字符串
     * @param configId 配置ID
     * @return
     */
    ConditionGroup[] getConfigDataById(Integer configId);

}
