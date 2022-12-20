package com.faber.config.interceptor;

import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.annotation.LogNoRet;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 请求URL日志拦截
 * @author xu.pengfei
 * @date 2022/11/28 11:32
 */
@Slf4j
public class GateLogInterceptor extends AbstractInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        FaLogBiz faLogBiz = super.getMethodAnno(handler, FaLogBiz.class);
        FaLogOpr faLogOpr = super.getMethodAnno(handler, FaLogOpr.class);

        request.setAttribute("FaLogBiz", faLogBiz != null ? faLogBiz.value() : "");
        request.setAttribute("FaLogOpr", faLogOpr != null ? faLogOpr.value() : "");

        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        LogNoRet annotation = super.getMethodAnno(handler, LogNoRet.class);
        response.setHeader("LogNoRet", annotation != null ? "1" : "0");
        super.afterCompletion(request, response, handler, ex);
    }

}
