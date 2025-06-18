package com.faber.core.config.redis.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;


/**
 * 批量删除redis中的缓存
 * @author xupengfei
 * @email faberxu@gmail.com
 * @date 2022/12/8 15:24
 */
@Retention(RetentionPolicy.RUNTIME)//在运行时可以获取
@Target(value = {ElementType.METHOD, ElementType.TYPE})//作用到类，方法，接口上等
public @interface FaCacheClear {

    /**
     * 缓存key的前缀。会加入keyPrefix前缀，和*模糊匹配后缀
     */
    String pre() default "";

    /**
     * 缓存key，从方法参数中获取，目前支持取第一个参数
     */
    String key() default "";

}
