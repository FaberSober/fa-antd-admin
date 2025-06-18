package com.faber.core.annotation;

import java.lang.annotation.*;

/**
 * 导入时，复制bean，是否忽略字段
 */
@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Inherited
public @interface FaPropIgnore {
}
