package com.faber.core.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 加此注解跳过{@link RequestAgainFilter}过滤器
 * @author xu.pengfei
 * @date 2024/08/27 21:52
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value={ElementType.METHOD,ElementType.TYPE})
public @interface NoFilter {
}
