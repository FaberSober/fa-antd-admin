package com.faber.admin.config.bootlistener;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * @Author: xu.pengfei
 * @Email: faberxu@gmail.com
 * @Date: 2018-08-21 9:25
 */
@Component
public class MyServletContextListener implements ServletContextListener {

    private final Logger _logger = LoggerFactory.getLogger(this.getClass());

    @Override
    public void contextInitialized(ServletContextEvent sce) {
        _logger.info("------------contextInitialized------------");
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        _logger.info("------------contextDestroyed------------");
    }
}
