package com.faber.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Bean属性配置
 * @author xupengfei
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value={ElementType.FIELD,ElementType.TYPE})
public @interface FaCol {

    /**
     * 属性中文名
     * @return
     */
    String value() default "";

    /**
     * 是否富文本字段
     * @return
     */
    boolean richHtml() default false;

    /**
     * 导入时，复制bean，是否忽略字段
     * @return
     */
    boolean excelImportIgnore() default false;

}
