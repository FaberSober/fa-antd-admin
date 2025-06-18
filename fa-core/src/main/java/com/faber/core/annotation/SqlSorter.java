package com.faber.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 指定实体的排序字段
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value={ElementType.FIELD,ElementType.TYPE})
public @interface SqlSorter {

    /**
     * 属性中文名
     * @return
     */
    String value() default "";

    /**
     * 是否自动填充排序字段，如果true，每次save之前会查询相同parentId下最大的sort，然后+1赋给新entity然后入库
     * @return
     */
    boolean autoSort() default true;

}
