package com.faber.admin.mapper;

import com.faber.admin.entity.SystemUpdateLog;
import org.apache.ibatis.annotations.Param;
import tk.mybatis.mapper.common.Mapper;

/**
 * BASE-系统版本更新日志表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-08-17 17:10:02
 */
// @Mapper
public interface SystemUpdateLogMapper extends Mapper<SystemUpdateLog> {

    /**
     * 获取最近当前版本ID
     * @return
     */
    int getCurVerId();

}
