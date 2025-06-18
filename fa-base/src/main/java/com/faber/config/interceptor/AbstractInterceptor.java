package com.faber.config.interceptor;

import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.lang.annotation.Annotation;

public abstract class AbstractInterceptor implements HandlerInterceptor {

    protected <A extends Annotation> A getMethodAnno(Object handler, Class<A> annoClazz) {
        if (!(handler instanceof HandlerMethod)) {
            return null;
        }
        HandlerMethod handlerMethod = (HandlerMethod) handler;
        A annotation = handlerMethod.getBeanType().getAnnotation(annoClazz);
        if (annotation == null) {
            annotation = handlerMethod.getMethodAnnotation(annoClazz);
        }
        return annotation;
    }

}
