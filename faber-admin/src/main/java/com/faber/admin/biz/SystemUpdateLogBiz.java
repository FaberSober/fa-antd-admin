package com.faber.admin.biz;

import org.springframework.stereotype.Service;

import com.faber.admin.entity.SystemUpdateLog;
import com.faber.admin.mapper.SystemUpdateLogMapper;
import com.faber.common.biz.BaseBiz;

/**
 * BASE-系统版本更新日志表
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-08-17 17:10:02
 */
@Service
public class SystemUpdateLogBiz extends BaseBiz<SystemUpdateLogMapper,SystemUpdateLog> {
}