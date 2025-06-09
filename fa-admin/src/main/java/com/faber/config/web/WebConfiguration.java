package com.faber.config.web;

import cn.dev33.satoken.interceptor.SaInterceptor;
import cn.hutool.core.collection.ListUtil;
import cn.hutool.extra.spring.SpringUtil;
import com.faber.config.interceptor.*;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;

import java.util.List;

/**
 * @author xu.pengfei
 * @description
 * @date 2023-03-12 09:50:00
 */
@Primary
@Configuration("adminWebConfig")
public class WebConfiguration extends BaseWebConfiguration {

    /**
     * Admin管理平台接口（适用于基础账户base_user登录）
     */
    private static final List<String> API_URLS = ListUtil.toList("/api/**");

    /**
     * 对外暴露的接口（适用于使用api token登录）
     */
    private static final List<String> OUTAPI_URLS = ListUtil.toList("/outapi/**");

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        // ---------------------- Admin管理平台接口（适用于基础账户base_user登录） ----------------------
        registry.addInterceptor(new FirstEmptyInterceptor()).addPathPatterns(API_URLS); // 拦截获取request IP
        registry.addInterceptor(SpringUtil.getBean(UserAuthRestInterceptor.class)).addPathPatterns(API_URLS); // 拦截用户token
        registry.addInterceptor(new SaInterceptor()).addPathPatterns(API_URLS); // 注册 Sa-Token 拦截器打开注解鉴权功能
        registry.addInterceptor(SpringUtil.getBean(UserDeviceInterceptor.class)).addPathPatterns(API_URLS); // 拦截APP用户设备信息
        registry.addInterceptor(SpringUtil.getBean(PermissionInterceptor.class)).addPathPatterns(API_URLS); // 拦截用户权限
        registry.addInterceptor(new GateLogInterceptor()).addPathPatterns(API_URLS); // 请求URL日志拦截

        // ---------------------- 对外暴露的接口（适用于使用api token登录） ----------------------
        registry.addInterceptor(new ApiTokenInterceptor()).addPathPatterns(OUTAPI_URLS); // 对外提供的api接口权限校验
    }

}
