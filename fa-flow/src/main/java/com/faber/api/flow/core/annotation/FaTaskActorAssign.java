package com.faber.api.flow.core.annotation;

import java.lang.annotation.*;

/**
 * 加在方法注解上，作用为：使用代码给流程task指定处理人
 */
@Target(ElementType.METHOD)          // 注解作用于方法
@Retention(RetentionPolicy.RUNTIME) // 运行时可通过反射获取
@Documented
public @interface FaTaskActorAssign {
    
    /** 方法描述 */
    String desc() default "";

}
