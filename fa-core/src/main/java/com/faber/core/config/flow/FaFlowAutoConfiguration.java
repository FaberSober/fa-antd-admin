package com.faber.core.config.flow;

import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.faber.core.service.FaFlowService;

// 非常重要：放在 core 包下，不要放在 fa-flow 里
@Configuration
// 关键点：只有当 FaFlowService 的实现类存在于 classpath 时才生效
// @ConditionalOnClass(name = "com.faber.flow.service.impl.FaFlowServiceImpl")  // ← 改成你真正的实现类全限定名
public class FaFlowAutoConfiguration {

    @Bean
    @ConditionalOnMissingBean(FaFlowService.class) // 如果容器中没有 FaFlowService 的实现类，则使用此默认实现
    public FaFlowService faFlowService() {
        return new FaFlowService() {}; // 空实现，调用所有方法都返回默认值
    }
    
}
