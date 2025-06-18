package com.faber.core.config.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 加此注解，在上下文中设置账户为admin。适用于不鉴权的接口，但是接口需要记录操作人信息。
 * @author xu.pengfei
 * @date 2022/11/28 11:36
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(value={ElementType.METHOD,ElementType.TYPE})
public @interface AdminOpr {
}
