package com.faber.admin.config.runner;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

/**
 * 启动执行器
 * @author xu.pengfei
 * @create 2022/09/29
 */
@Slf4j
@Configuration
public class AuthServerRunner implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        log.debug("running.");
    }
}
