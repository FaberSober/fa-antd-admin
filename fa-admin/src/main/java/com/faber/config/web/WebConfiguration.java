package com.faber.config.web;

import cn.hutool.core.collection.ListUtil;
import com.faber.core.config.exception.GlobalExceptionHandler;
import com.faber.config.interceptor.*;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurationSupport;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.TimeZone;

/**
 * @author ${USER}
 * @description
 * @date ${DATE} ${TIME}
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
        registry.addInterceptor(getFirstEmptyInterceptor()).addPathPatterns(API_URLS); // 拦截获取request IP
        registry.addInterceptor(getUserAuthRestInterceptor()).addPathPatterns(API_URLS); // 拦截用户token
        registry.addInterceptor(getPermissionInterceptor()).addPathPatterns(API_URLS); // 拦截用户权限
        registry.addInterceptor(getGateLogInterceptor()).addPathPatterns(API_URLS); // 请求URL日志拦截


        // ---------------------- 对外暴露的接口（适用于使用api token登录） ----------------------
        registry.addInterceptor(getApiTokenInterceptor()).addPathPatterns(OUTAPI_URLS); // 对外提供的api接口权限校验
    }

}
