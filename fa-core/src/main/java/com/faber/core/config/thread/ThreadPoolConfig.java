package com.faber.core.config.thread;

import com.faber.core.constant.FaSetting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import jakarta.annotation.Resource;
import java.util.concurrent.Executor;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * 线程池
 *
 * @author xu.pengfei
 * @date 2022/11/28 14:00
 */
@Configuration
@EnableAsync
public class ThreadPoolConfig {

    @Resource
    FaSetting faSetting;

    @Bean(name = "executor")
    public Executor getAsyncThread() {
        FaSetting.ThreadPoolConfig config = faSetting.getThreadPoolConfig();
        if (config == null) {
            config = new FaSetting.ThreadPoolConfig();
        }

        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();
        // 线程池维护线程的最少数量
        taskExecutor.setCorePoolSize(config.getCorePoolSize());
        // 线程池维护线程的最大数量,只有在缓冲队列满了之后才会申请超过核心线程数的线程
        taskExecutor.setMaxPoolSize(config.getMaxPoolSize());
        // 缓存队列
        taskExecutor.setQueueCapacity(config.getQueueCapacity());
        // 允许的空闲时间,当超过了核心线程出之外的线程在空闲时间到达之后会被销毁
        taskExecutor.setKeepAliveSeconds(config.getKeepAliveSeconds());
        // 线程名称前缀
        taskExecutor.setThreadNamePrefix(config.getThreadNamePrefix());
        // 线程池对拒绝任务（无线程可用）的处理策略，目前只支持AbortPolicy、CallerRunsPolicy；默认为后者
        taskExecutor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        // 调度器shutdown被调用时等待当前被调度的任务完成
        taskExecutor.setWaitForTasksToCompleteOnShutdown(config.isWaitForJobsToCompleteOnShutdown());
        // 等待时长
        taskExecutor.setAwaitTerminationSeconds(config.getAwaitTerminationSeconds());
        taskExecutor.initialize();
        return taskExecutor;
    }

}
