package com.faber.config.interceptor;

import com.faber.core.config.annotation.CrossResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.method.HandlerMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 跨域访问拦截
 * @author xu.pengfei
 * @date 2022/11/28 11:32
 */
@Slf4j
public class CrossInterceptor extends AbstractInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        CrossResponse annotation = this.getCrosResponse(handler);
        if (annotation != null) {
            response.setHeader("Access-Control-Allow-Origin", "*");
        }
        super.afterCompletion(request, response, handler, ex);
    }

    protected CrossResponse getCrosResponse(Object handler) {
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        CrossResponse annotation = handlerMethod.getBeanType().getAnnotation(CrossResponse.class);
        if (annotation == null) {
            annotation = handlerMethod.getMethodAnnotation(CrossResponse.class);
        }
        return annotation;
    }

}
