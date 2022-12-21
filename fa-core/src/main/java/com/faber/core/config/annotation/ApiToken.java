package com.faber.core.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 对外提供的接口，使用此注解验证请求中的token
 * @author xu.pengfei
 * @date 2022/11/28 11:36
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value={ElementType.METHOD,ElementType.TYPE})
public @interface ApiToken {
}
