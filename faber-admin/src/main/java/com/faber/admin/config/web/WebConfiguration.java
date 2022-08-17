package com.faber.admin.config.web;

import com.faber.admin.config.interceptor.ApiTokenInterceptor;
import com.faber.admin.config.interceptor.PermissionInterceptor;
import com.faber.admin.config.interceptor.UserAuthRestInterceptor;
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
import java.util.ArrayList;
import java.util.Collections;
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
        // 系统内部/api接口权限校验
        registry.addInterceptor(getUserAuthRestInterceptor()).addPathPatterns(getIncludePathPatterns());
        registry.addInterceptor(getPermissionInterceptor()).addPathPatterns(getIncludePathPatterns());
//        registry.addInterceptor(getCrosInterceptor()).addPathPatterns(getIncludePathPatterns());

        // 对外提供的api接口权限校验
        registry.addInterceptor(getApiTokenInterceptor()).addPathPatterns(getApiPathPatterns());
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
//    CrossInterceptor getCrosInterceptor() {
//        return new CrossInterceptor();
//    }

    /**
     * 需要用户和服务认证判断的路径
     */
    private ArrayList<String> getIncludePathPatterns() {
        ArrayList<String> list = new ArrayList<>();
        String[] urls = {
                "/user/**",
                "/api/**"
        };
        Collections.addAll(list, urls);
        return list;
    }

    /**
     * 对外提供的API接口的路径。
     * 对外提供的API接口统一前缀：/outapi/api/v1/xxx
     */
    private ArrayList<String> getApiPathPatterns() {
        ArrayList<String> list = new ArrayList<>();
        String[] urls = {
                "/outapi/**"
        };
        Collections.addAll(list, urls);
        return list;
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
