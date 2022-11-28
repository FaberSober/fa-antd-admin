package com.faber.buzz.admin.biz;

import com.faber.buzz.admin.entity.LogApi;
import com.faber.buzz.admin.mapper.LogApiMapper;
import com.faber.common.biz.BaseBiz;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * URL请求日志
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class LogApiBiz extends BaseBiz<LogApiMapper, LogApi> {

}
