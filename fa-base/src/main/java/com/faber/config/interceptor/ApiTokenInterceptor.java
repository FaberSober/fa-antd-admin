package com.faber.config.interceptor;

import com.faber.api.base.admin.biz.UserBiz;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.api.base.admin.entity.User;
import com.faber.config.utils.user.UserCheckUtil;
import com.faber.core.context.BaseContextHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 用户授权过滤器
 * 1. 过滤request#header的jwt token授权字段：Authorization
 */
@Slf4j
public class ApiTokenInterceptor extends AbstractInterceptor {

    @Autowired
    private UserBiz userBiz;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 配置该注解，说明不进行用户拦截
        IgnoreUserToken annotation = super.getMethodAnno(handler, IgnoreUserToken.class);
        if (annotation != null) {
            this.setUserInfo();
            return super.preHandle(request, response, handler);
        }

        // 校验请求的token
        String token = request.getHeader("token");
        if (StringUtils.isEmpty(token)) {
            this.setUserInfo();
            return super.preHandle(request, response, handler);
        }

        // 判断用户状态是否正常
        User user = userBiz.findByApiToken(token);
        UserCheckUtil.checkUserValid(user);

        BaseContextHandler.setUsername(user.getUsername());
        BaseContextHandler.setName(user.getName());
        BaseContextHandler.setUserId(user.getId() + "");
        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        BaseContextHandler.remove();
        super.afterCompletion(request, response, handler, ex);
    }

    /**
     * 这里默认给线程赋上userId=1的用户
     */
    private void setUserInfo() {
        // 这里默认给线程赋上userId=1的用户
        User user = userBiz.getById("1");
        BaseContextHandler.setUsername(user.getUsername());
        BaseContextHandler.setName(user.getName());
        BaseContextHandler.setUserId(user.getId() + "");
    }
}
