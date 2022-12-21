package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.LogApi;
import com.faber.api.base.admin.mapper.LogApiMapper;
import com.faber.core.web.biz.BaseBiz;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * URL请求日志
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class LogApiBiz extends BaseBiz<LogApiMapper, LogApi> {

}
