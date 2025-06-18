package com.faber.config.websocket;

import cn.hutool.core.util.ClassUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;


/**
 * 服务启动扫描WebSocket业务服务接口
 */
@Order(value = 1)
@Slf4j
@Configuration
public class WsInitRunner implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        // 扫描实现了WsBaseService的业务bean，注册server监听接口
        ClassUtil.scanPackageBySuper("com.faber", WsBaseService.class).forEach(clazz -> {
            WsHolder.addService((Class<WsBaseService>) clazz);
        });
    }

}
