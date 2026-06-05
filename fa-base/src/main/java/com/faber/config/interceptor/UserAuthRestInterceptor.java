package com.faber.config.interceptor;

import cn.dev33.satoken.exception.NotLoginException;
import cn.dev33.satoken.stp.StpUtil;
import cn.hutool.core.util.StrUtil;
import com.faber.api.base.admin.biz.UserBiz;
import com.faber.api.base.admin.biz.UserTokenBiz;
import com.faber.api.base.admin.entity.User;
import com.faber.api.base.admin.entity.UserToken;
import com.faber.api.base.tn.biz.TenantUserBiz;
import com.faber.core.config.annotation.AdminOpr;
import com.faber.core.config.annotation.ApiToken;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.constant.CommonConstants;
import com.faber.core.constant.FaSetting;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.exception.auth.UserTokenException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 用户授权过滤器
 * 1. 过滤request#header的jwt token授权字段：Authorization
 * @author farando
 * @date 2022/11/28 11:33
 */
@Slf4j
@Component
public class UserAuthRestInterceptor extends AbstractInterceptor {

    @Resource
    private UserBiz userBiz;

    @Resource
    private UserTokenBiz userTokenBiz;

    @Resource
    private TenantUserBiz tenantUserBiz;

    @Resource
    private FaSetting faSetting;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 配置该注解，说明在上下文中注入当前操作用户为admin
        AdminOpr adminOpr = getMethodAnno(handler, AdminOpr.class);
        if (adminOpr != null) {
            User user = userBiz.getById(1L);
            userBiz.setUserLogin(user);
            return super.preHandle(request, response, handler);
        }

        // 配置该注解，说明不进行用户拦截
        IgnoreUserToken ignoreUserToken = getMethodAnno(handler, IgnoreUserToken.class);
        if (ignoreUserToken != null) {
            return super.preHandle(request, response, handler);
        }

        // type 1: 读取API信息
        ApiToken apiToken = getMethodAnno(handler, ApiToken.class);
        if (apiToken != null) {
            User user = userBiz.getUserFromApiToken();
            userBiz.setUserLogin(user, "api");
            this.resolveUserTenant(request, user.getId());
            return super.preHandle(request, response, handler);
        }

        // type 2: 读取header中jwt用户信息
        String token = StpUtil.getTokenValue();
        if (StrUtil.isEmpty(token)) {
            throw new UserTokenException("令牌失效，请重新登录！");
        }

        // sa-token获取登录账户信息
        String userId = null;
        try {
            userId = StpUtil.getLoginIdAsString();
        } catch (Exception e) {
            // 这里不处理异常，是为了简化可以同时兼容api token调用的形式，简化了操作，但是有安全性的问题。如果项目安全要求较高，可以自行修改抛出异常
            if (e instanceof UserTokenException || e instanceof NotLoginException) {
                log.warn(e.getMessage());
            } else {
                log.error(e.getMessage(), e);
            }

            // 尝试ApiToken登录
            UserToken userToken = userTokenBiz.getById(token);
            if (userToken != null && userToken.getValid()) {
                userId = userToken.getUserId();
            }
        }

        if (userId == null) {
            throw new UserTokenException("令牌失效，请重新登录！");
        }

        // 用户登录状态设置
        userBiz.setUserLogin(userId);
        this.resolveUserTenant(request, userId);

        return super.preHandle(request, response, handler);
    }

    private void resolveUserTenant(HttpServletRequest request, String userId) {
        if (faSetting.getTenant() == null || !faSetting.getTenant().isEnabled()) {
            BaseContextHandler.setTenantId(null);
            return;
        }

        String tenantId = request.getHeader(CommonConstants.FA_TN_TENANT_ID);
        if (StrUtil.isNotBlank(tenantId)) {
            if (!tenantUserBiz.hasUserTenant(userId, tenantId)) {
                throw new UserTokenException("当前账户无权访问该租户");
            }
        } else {
            tenantId = tenantUserBiz.getDefaultTenantId(userId);
        }
        BaseContextHandler.setTenantId(tenantId);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
//        BaseContextHandler.remove(); // 放到Filter中去执行
        super.afterCompletion(request, response, handler, ex);
    }

}
