package com.faber.common.annotation;

import java.lang.annotation.*;

/**
 * 权限校验
 */
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface FaPermission {

    String permission() default "";

}
