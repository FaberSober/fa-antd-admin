package com.faber.admin.config.interceptor;

import com.faber.admin.biz.UserBiz;
import com.faber.admin.util.jwt.IJWTInfo;
import com.faber.admin.util.jwt.UserAuthUtil;
import com.faber.admin.util.user.UserCheckUtil;
import com.faber.admin.config.annotation.IgnoreUserToken;
import com.faber.admin.config.redis.KeyConfiguration;
import com.faber.admin.entity.User;
import com.faber.common.context.BaseContextHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 用户授权过滤器
 * 1. 过滤request#header的jwt token授权字段：Authorization
 */
@Slf4j
public class UserAuthRestInterceptor extends AbstractInterceptor {

    @Autowired
    private UserAuthUtil userAuthUtil;

    @Autowired
    private KeyConfiguration keyConfiguration;

    @Autowired
    private UserBiz userBiz;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 配置该注解，说明不进行用户拦截
        IgnoreUserToken annotation = getIgnoreUserToken(handler);
        if (annotation != null) {
            return super.preHandle(request, response, handler);
        }
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
        IJWTInfo infoFromToken = userAuthUtil.getInfoFromToken(token);

        // 判断用户状态是否正常
        User user = userBiz.getUserById(infoFromToken.getId());
        UserCheckUtil.checkUserValid(user);

        BaseContextHandler.setUsername(infoFromToken.getUniqueName());
        BaseContextHandler.setName(infoFromToken.getName());
        BaseContextHandler.setUserID(infoFromToken.getId());
        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        BaseContextHandler.remove();
        super.afterCompletion(request, response, handler, ex);
    }
}
