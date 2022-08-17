package com.faber.common.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Component;

/**
 * Created by xu.pengfei@zte.com.cn on 2017/9/6.<br/>
 * spring工具类，为了更方便的获取spring的applicationContext直接实现接口ApplicationContextAware
 */
@Component
public class SpringUtil implements ApplicationContextAware {

    private static final Logger logger = LoggerFactory.getLogger(SpringUtil.class);
    private static ApplicationContext applicationContext;

    @Override
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        if (SpringUtil.applicationContext == null) {
            SpringUtil.applicationContext = applicationContext;
        }
        logger.info("------------ApplicationContext配置成功，在普通类可以通过SpringUtil.getApplicationContext()获取ApplicationContext对象，applicationContext="
                + SpringUtil.applicationContext + "------------");
    }

    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

//    public static Object getBean(String beanName) {
//        return applicationContext.getBean(beanName);
//    }

    /***
     * 根据name获取bean
     * @param name
     * @param <T>
     * @return
     */
    @SuppressWarnings("unchecked")
    public static <T> T getBean(String name) {
        return (T) getApplicationContext().getBean(name);
    }

    public static <T> T getBean(Class<T> aClass) {
        return applicationContext.getBean(aClass);
    }

    public static <T> T getBean(Class<T> aClass, String beanName) {
        return applicationContext.getBean(aClass, beanName);
    }

    /**
     * 获取当前环境
     *
     * @return
     */
    public static String getActiveProfile() {
        return applicationContext.getEnvironment().getActiveProfiles()[0];
    }
}
