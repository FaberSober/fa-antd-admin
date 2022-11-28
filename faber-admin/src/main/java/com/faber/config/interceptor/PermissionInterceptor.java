package com.faber.config.interceptor;

import cn.hutool.core.util.StrUtil;
import com.faber.common.config.annotation.IgnoreUserToken;
import com.faber.common.config.annotation.Permission;
import com.faber.common.context.BaseContextHandler;
import com.faber.common.exception.auth.UserNoPermissionException;
import com.faber.rbac.biz.RbacUserRoleBiz;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * TODO 用户权限点校验
 * @author xu.pengfei
 * @date 2022/11/28 11:32
 */
@Slf4j
public class PermissionInterceptor extends AbstractInterceptor {

    @Autowired
    private RbacUserRoleBiz rbacUserRoleBiz;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 配置该注解，说明不进行用户拦截
        IgnoreUserToken annotation = super.getIgnoreUserToken(handler);
        if (annotation != null) {
            return super.preHandle(request, response, handler);
        }

        Permission permission = super.getPermission(handler);
        if (permission == null || StrUtil.isEmpty(permission.permission())) {
            return super.preHandle(request, response, handler);
        }
        boolean hasPermission = rbacUserRoleBiz.checkUserLinkUrl(BaseContextHandler.getUserId(), permission.permission());
        if (!hasPermission) {
            throw new UserNoPermissionException("无权访问");
        }

        return super.preHandle(request, response, handler);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, Exception ex) throws Exception {
        super.afterCompletion(request, response, handler, ex);
    }
}
