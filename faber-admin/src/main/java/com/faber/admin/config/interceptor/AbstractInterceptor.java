package com.faber.admin.config.interceptor;

import com.faber.admin.config.annotation.ApiToken;
import com.faber.admin.config.annotation.IgnoreUserToken;
import com.faber.admin.config.annotation.Permission;
import com.faber.admin.config.redis.KeyConfiguration;
import com.faber.admin.util.jwt.IJWTInfo;
import com.faber.admin.util.jwt.UserAuthUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public abstract class AbstractInterceptor implements HandlerInterceptor {

    @Autowired
    private UserAuthUtil userAuthUtil;

    @Autowired
    private KeyConfiguration keyConfiguration;

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

    protected IJWTInfo getJwtInfo(HttpServletRequest request) throws Exception {
        String token = request.getHeader(keyConfiguration.getTokenHeader());
        if (StringUtils.isEmpty(token)) {
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if (cookie.getName().equals(keyConfiguration.getTokenHeader())) {
                        token = cookie.getValue();
                    }
                }
            }
        }
        return userAuthUtil.getInfoFromToken(token);
    }

}
