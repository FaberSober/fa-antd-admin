package com.faber.core.config.aspect;

import lombok.extern.slf4j.Slf4j;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.stereotype.Component;


/**
 * 耗时统计
 */
@Slf4j
@Aspect
@Component
public class TakeTimeAspect {
    //统计请求的处理时间
    ThreadLocal<Long> startTime = new ThreadLocal<>();
    ThreadLocal<Long> endTime = new ThreadLocal<>();
    ThreadLocal<String> methodName = new ThreadLocal<>();

    /**
     * 带有@TakeTime注解的方法
     */
//    @Pointcut("within(com.faber.backend.user.controller.*)")
//    @Pointcut("execution(* com.faber.backend.user.controller.*.*(..))")
    @Pointcut("@annotation(com.faber.core.config.annotation.TakeTime)")
    public void TakeTime() {
    }

    //    @Before("within(com.faber.backend.user.controller.*)")
    @Before("TakeTime()")
    public void doBefore(JoinPoint joinPoint) {
        // 获取方法的名称
//        String methodName = joinPoint.getSignature().getName();
        methodName.set(joinPoint.getSignature().getName());
        // 获取方法入参
//        Object[] param = joinPoint.getArgs();
//        StringBuilder sb = new StringBuilder();
//        for (Object o : param) {
//            sb.append(o + ";");
//        }
//        log.info("进入《{}》 方法,参数为: {}", methodName,sb.toString());

        startTime.set(System.currentTimeMillis());
    }

    @AfterReturning(pointcut = "TakeTime()")
    public void doAfterReturning() {
        endTime.set(System.currentTimeMillis());
        log.info("方法执行时间:" + (endTime.get() - startTime.get()));
    }

}
