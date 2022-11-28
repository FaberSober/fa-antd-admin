package com.faber.common.annotation;

import com.faber.common.web.biz.BaseBiz;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * {@link BaseBiz#selectByQuery}方法查询中，search多字段组合Like or查询
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value={ElementType.FIELD,ElementType.TYPE})
public @interface SqlSearch {
}
