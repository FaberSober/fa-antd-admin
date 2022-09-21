package com.faber.admin.config.web;

import cn.hutool.core.collection.ListUtil;
import com.faber.admin.config.interceptor.*;
import com.faber.common.handler.GlobalExceptionHandler;
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
 * @author ace
 * @date 2017/9/8
 */
@Configuration("admimWebConfig")
@Primary
public class WebConfiguration extends WebMvcConfigurationSupport {

    @Value("${spring.jackson.date-format}")
    private String dateFormatPattern;

    @Value("${spring.jackson.time-zone}")
    private String timeZone;

    private static final List<String> API_URLS = ListUtil.toList("/api/**");
    private static final List<String> OUTAPI_URLS = ListUtil.toList("/outapi/**");

    @Bean
    GlobalExceptionHandler getGlobalExceptionHandler() {
        return new GlobalExceptionHandler();
    }

    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        //默认的资源映射需要填写，不然不能正常访问
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");
        //调用基类的方法
        super.addResourceHandlers(registry);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(getFirstEmptyInterceptor()).addPathPatterns("/api/**");

        // 系统内部/api接口权限校验
        registry.addInterceptor(getUserAuthRestInterceptor()).addPathPatterns(API_URLS);
        registry.addInterceptor(getPermissionInterceptor()).addPathPatterns(API_URLS);
//        registry.addInterceptor(getCrosInterceptor()).addPathPatterns(getIncludePathPatterns());

        // 请求URL日志拦截
//        registry.addInterceptor(getGateLogInterceptor()).addPathPatterns("/api/**");

        // 对外提供的api接口权限校验
        registry.addInterceptor(getApiTokenInterceptor()).addPathPatterns(OUTAPI_URLS);
    }

    @Bean
    UserAuthRestInterceptor getUserAuthRestInterceptor() {
        return new UserAuthRestInterceptor();
    }

    @Bean
    PermissionInterceptor getPermissionInterceptor() {
        return new PermissionInterceptor();
    }

    @Bean
    ApiTokenInterceptor getApiTokenInterceptor() {
        return new ApiTokenInterceptor();
    }

//    @Bean
//    GateLogInterceptor getGateLogInterceptor() {
//        return new GateLogInterceptor();
//    }

    @Bean
    FirstEmptyInterceptor getFirstEmptyInterceptor() {
        return new FirstEmptyInterceptor();
    }

    /**
     * SpringBoot2 版本中spring.jackson.date-format设置以后不生效的速效解决方法
     * https://blog.csdn.net/u012581020/article/details/105955060
     * @param converters
     */
    @Override
    protected void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        ObjectMapper objectMapper = converter.getObjectMapper();
        // 生成JSON时,将所有Long转换成String
        SimpleModule simpleModule = new SimpleModule();
        simpleModule.addSerializer(Long.class, ToStringSerializer.instance);
        simpleModule.addSerializer(Long.TYPE, ToStringSerializer.instance);
        objectMapper.registerModule(simpleModule);
        // 时间格式化
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        //这个可以引用spring boot yml 里的格式化配置和时区配置
        objectMapper.setDateFormat(new SimpleDateFormat(dateFormatPattern));
        objectMapper.setTimeZone(TimeZone.getTimeZone(timeZone));
        // 设置格式化内容
        converter.setObjectMapper(objectMapper);
        converters.add(0, converter);
        super.extendMessageConverters(converters);
    }

}
