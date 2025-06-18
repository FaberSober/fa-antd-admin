package com.faber.api.base.admin.mapper;

import com.faber.core.config.mybatis.base.FaBaseMapper;
import com.faber.api.base.admin.entity.SystemUpdateLog;
import org.apache.ibatis.annotations.MapKey;
import org.apache.ibatis.annotations.Param;

import java.util.Map;

/**
 * BASE-系统版本更新日志表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-08-17 17:10:02
 */
public interface SystemUpdateLogMapper extends FaBaseMapper<SystemUpdateLog> {

    /**
     * 获取最近当前版本ID
     * @return
     */
    int getCurVerId();

    @MapKey("id")
    Map<String, Object> queryTableSchema(@Param("tableName") String tableName);

    @MapKey("id")
    Map<String, Object> queryColSchema(@Param("tableName") String tableName, @Param("colName") String colName);

}
