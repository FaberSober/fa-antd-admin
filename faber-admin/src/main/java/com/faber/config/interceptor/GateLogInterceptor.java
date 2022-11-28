package com.faber.config.interceptor;

import com.faber.common.annotation.LogNoRet;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 请求URL日志拦截
 */
@Slf4j
public class GateLogInterceptor extends AbstractInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        LogNoRet annotation = super.getLogNoRet(handler);
        response.setHeader("LogNoRet", annotation != null ? "1" : "0");
        super.afterCompletion(request, response, handler, ex);
    }

}
