package com.faber.api.admin.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.faber.api.admin.entity.SystemUpdateLog;

/**
 * BASE-系统版本更新日志表
 * 
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-08-17 17:10:02
 */
public interface SystemUpdateLogMapper extends BaseMapper<SystemUpdateLog> {

    /**
     * 获取最近当前版本ID
     * @return
     */
    int getCurVerId();

}
