package com.faber.admin.config.interceptor;

import com.faber.admin.config.annotation.ApiToken;
import com.faber.admin.config.annotation.IgnoreUserToken;
import com.faber.admin.config.annotation.Permission;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;

public abstract class AbstractInterceptor extends HandlerInterceptorAdapter {

    protected IgnoreUserToken getIgnoreUserToken(Object handler) {
        if (!(handler instanceof HandlerMethod)) {
            return null;
        }
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        // 配置该注解，说明不进行用户拦截
        IgnoreUserToken annotation = handlerMethod.getBeanType().getAnnotation(IgnoreUserToken.class);
        if (annotation == null) {
            annotation = handlerMethod.getMethodAnnotation(IgnoreUserToken.class);
        }
        return annotation;
    }

    protected Permission getPermission(Object handler) {
        if (!(handler instanceof HandlerMethod)) {
            return null;
        }
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        // 配置该注解，说明要进行权限校验
        Permission annotation = handlerMethod.getBeanType().getAnnotation(Permission.class);
        if (annotation == null) {
            annotation = handlerMethod.getMethodAnnotation(Permission.class);
        }
        return annotation;
    }

    protected ApiToken getApiToken(Object handler) {
        if (!(handler instanceof HandlerMethod)) {
            return null;
        }
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        // 配置该注解，说明要进行api接口验证
        ApiToken annotation = handlerMethod.getBeanType().getAnnotation(ApiToken.class);
        if (annotation == null) {
            annotation = handlerMethod.getMethodAnnotation(ApiToken.class);
        }
        return annotation;
    }

}
