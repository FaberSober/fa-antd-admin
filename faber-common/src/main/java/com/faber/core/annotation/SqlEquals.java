package com.faber.core.annotation;

import com.faber.core.web.biz.BaseBiz;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * {@link BaseBiz#selectByQuery}方法查询中，string属性指定为equals查询
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value={ElementType.FIELD,ElementType.TYPE})
public @interface SqlEquals {
}
