package com.faber.api.base.admin.mapper;

import com.faber.api.base.admin.entity.ConfigScene;
import org.apache.ibatis.annotations.Param;
import com.faber.core.config.mybatis.base.FaBaseMapper;

/**
 * 系统-配置表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2020-06-02 21:21:45
 */
public interface ConfigSceneMapper extends FaBaseMapper<ConfigScene> {

    int findMaxSort(@Param("biz") String biz, @Param("crtUser") String crtUser);

    void clearOtherDefaultScene(@Param("biz") String biz, @Param("crtUser") String crtUser);

}
