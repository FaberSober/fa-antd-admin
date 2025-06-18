package com.faber.api.base.admin.mapper;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.faber.core.config.mybatis.base.FaBaseMapper;
import com.faber.api.base.admin.entity.LogApi;
import io.lettuce.core.dynamic.annotation.Param;

public interface LogApiMapper extends FaBaseMapper<LogApi> {

    // 添加拦截忽略注解，指定忽略全表删除拦截器
    @InterceptorIgnore(blockAttack = "true")
    int deleteAll();

    /**
     * 删除超过数量的日志
     * @param minId 日志ID小于此ID的进行删除
     * @return
     */
    int deleteOverSize(@Param("minId") Long minId);

}
