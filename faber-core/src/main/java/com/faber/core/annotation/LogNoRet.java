package com.faber.core.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Controller中注解此方法，记录系统日志，不记录返回信息，如查询类的page分页，返回信息太大，不记录到系统日志中
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value={ElementType.METHOD,ElementType.TYPE})
public @interface LogNoRet {
}
