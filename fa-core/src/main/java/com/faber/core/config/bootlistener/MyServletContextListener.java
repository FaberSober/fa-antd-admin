package com.faber.core.config.bootlistener;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletContextEvent;
import jakarta.servlet.ServletContextListener;

/**
 * Servlet启动监听
 * @Author: xu.pengfei
 * @Email: faberxu@gmail.com
 * @Date: 2018-08-21 9:25
 */
@Slf4j
@Component
public class MyServletContextListener implements ServletContextListener {

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        log.info("------------contextInitialized------------");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        log.info("------------contextDestroyed------------");
    }
}
