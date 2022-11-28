package com.faber.config.interceptor;

import com.faber.common.context.BaseContextHandler;
import com.faber.common.utils.IpUtils;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 第一个空请求拦截，存储一些请求基本信息
 * @author xu.pengfei
 * @date 2022/11/28 11:32
 */
@Slf4j
public class FirstEmptyInterceptor extends AbstractInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 记录request ip
        BaseContextHandler.setUserIp(IpUtils.getRequestIp(request));

        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        super.afterCompletion(request, response, handler, ex);
    }
}
