package com.faber.api.base.admin.biz;

import com.faber.api.base.admin.entity.LogLogin;
import com.faber.api.base.admin.mapper.LogLoginMapper;
import org.springframework.stereotype.Service;

import com.faber.core.web.biz.BaseBiz;

/**
 * BASE-登录日志
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-27 17:09:01
 */
@Service
public class LogLoginBiz extends BaseBiz<LogLoginMapper, LogLogin> {
}