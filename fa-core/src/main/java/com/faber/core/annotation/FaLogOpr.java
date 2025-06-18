package com.faber.core.annotation;

import com.faber.core.enums.LogCrudEnum;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 日志模块-操作中文名称
 * @author xupengfei
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.METHOD})
public @interface FaLogOpr {

    String value() default "";

    LogCrudEnum crud() default LogCrudEnum.R;

}
