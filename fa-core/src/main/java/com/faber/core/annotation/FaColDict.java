package com.faber.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Bean属性指定为字典
 * @author xupengfei
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value={ElementType.FIELD,ElementType.TYPE})
public @interface FaColDict {

    /**
     * 字典编码，存在系统字典表中的编码Code
     * @return
     */
    String value() default "";

}
