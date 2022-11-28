package com.faber.config.interceptor;

import com.faber.common.config.annotation.ApiToken;
import com.faber.common.config.annotation.IgnoreUserToken;
import com.faber.common.config.annotation.Permission;
import com.faber.config.utils.jwt.JWTInfo;
import com.faber.config.utils.user.JwtTokenUtil;
import com.faber.common.annotation.LogNoRet;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

public abstract class AbstractInterceptor implements HandlerInterceptor {

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

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

    protected LogNoRet getLogNoRet(Object handler) {
        if (!(handler instanceof HandlerMethod)) {
            return null;
        }
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        // 配置该注解，说明不进行用户拦截
        LogNoRet annotation = handlerMethod.getBeanType().getAnnotation(LogNoRet.class);
        if (annotation == null) {
            annotation = handlerMethod.getMethodAnnotation(LogNoRet.class);
        }
        return annotation;
    }

    protected JWTInfo getJwtInfo(HttpServletRequest request) throws Exception {
        String token = request.getHeader(jwtTokenUtil.getTokenHeader());
        if (StringUtils.isEmpty(token)) {
            if (request.getCookies() != null) {
                for (Cookie cookie : request.getCookies()) {
                    if (cookie.getName().equals(jwtTokenUtil.getTokenHeader())) {
                        token = cookie.getValue();
                    }
                }
            }
        }
        return jwtTokenUtil.parseToken(token);
    }

}
