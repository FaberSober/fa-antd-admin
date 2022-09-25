package com.faber.admin.config.interceptor;

import com.faber.admin.config.annotation.IgnoreUserToken;
import lombok.extern.slf4j.Slf4j;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * TODO 用户权限点校验
 */
@Slf4j
public class PermissionInterceptor extends AbstractInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 配置该注解，说明不进行用户拦截
        IgnoreUserToken annotation = super.getIgnoreUserToken(handler);
        if (annotation != null) {
            return super.preHandle(request, response, handler);
        }
        return super.preHandle(request, response, handler);

        // TODO permission check
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        super.afterCompletion(request, response, handler, ex);
    }
}
