package com.faber.config.interceptor;

import cn.hutool.core.util.StrUtil;
import com.faber.api.base.admin.biz.UserDeviceBiz;
import com.faber.api.base.admin.entity.UserDevice;
import com.faber.core.config.annotation.IgnoreUserDevice;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.constant.CommonConstants;
import com.faber.core.exception.auth.UserDeviceInvalidException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * 用户设备访问过滤器
 * 1. 过滤request#header的jwt token授权字段：Authorization
 * @author xu.pengfei
 * @date 2022/11/28 11:33
 */
@Slf4j
@Component
public class UserDeviceInterceptor extends AbstractInterceptor {

    @Autowired
    private UserDeviceBiz userDeviceBiz;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 配置该注解，说明不进行用户拦截
        IgnoreUserToken ignoreUserToken = getMethodAnno(handler, IgnoreUserToken.class);
        if (ignoreUserToken != null) {
            return super.preHandle(request, response, handler);
        }

        // 配置该注解，说明不进行用户拦截
        IgnoreUserDevice ignoreUserDevice = getMethodAnno(handler, IgnoreUserDevice.class);
        if (ignoreUserDevice != null) {
            return super.preHandle(request, response, handler);
        }

        // type 2: 读取header中deviceId信息，判断设备编码是否允许访问
        String from = request.getHeader(CommonConstants.FA_FROM);
        String appDeviceId = request.getHeader(CommonConstants.FA_APP_DEVICE_ID);

        // 不是app的不校验
        if (!CommonConstants.FaFrom.FaApp.equals(from)) {
            return super.preHandle(request, response, handler);
        }

        if (StrUtil.isNotEmpty(appDeviceId)) {
            UserDevice userDevice = userDeviceBiz.getByDeviceId(appDeviceId);
            if (userDevice == null) {
                throw new UserDeviceInvalidException("设备未找到，请联系管理员！");
            }

            if (userDevice.getEnable() == null || !userDevice.getEnable()) {
                throw new UserDeviceInvalidException("设备未校验，请联系管理员！");
            }

            // update device last online time
            userDeviceBiz.updateLastOnlineTime(userDevice.getId());
        }

        return super.preHandle(request, response, handler);
    }

}
