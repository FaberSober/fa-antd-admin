package com.faber.admin.biz;

import com.faber.admin.entity.GateLog;
import com.faber.admin.mapper.GateLogMapper;
import com.faber.common.biz.BaseBiz;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * URL请求日志
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class GateLogBiz extends BaseBiz<GateLogMapper, GateLog> {

}
