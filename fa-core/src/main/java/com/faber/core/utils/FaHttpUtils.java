package com.faber.core.utils;

import com.faber.core.config.filter.wrapper.BodyHttpServletRequestWrapper;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * SpringBoot Http请求帮助类
 */
public class FaHttpUtils {

    /**
     * 获取线程http请求
     */
    public static HttpServletRequest getHttpServletRequest() {
        return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
    }

    /**
     * 获取线程http返回
     */
    public static HttpServletResponse getHttpServletResponse() {
        return ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getResponse();
    }

    /**
     * 获取post请求的body，返回string
     * @return
     */
    public static String getPostBody() {
        HttpServletRequest request = getHttpServletRequest();
        if (request instanceof BodyHttpServletRequestWrapper) {
            return ((BodyHttpServletRequestWrapper) request).getBody();
        }
        return null;
    }

}
