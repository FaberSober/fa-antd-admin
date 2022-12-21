package com.faber.config.quartz;

import org.jetbrains.annotations.NotNull;
import org.quartz.spi.TriggerFiredBundle;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.AutowireCapableBeanFactory;
import org.springframework.scheduling.quartz.AdaptableJobFactory;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;

/**
 * @Author: xu.pengfei
 * @Email: faberxu@gmail.com
 * @Date: 2018-08-21 9:16
 */
@Component
public class MyJobFactory extends AdaptableJobFactory {

    @Autowired
    private AutowireCapableBeanFactory capableBeanFactory;

    @NotNull
    @Override
    protected Object createJobInstance(@NotNull TriggerFiredBundle bundle) throws Exception {
        Object job = super.createJobInstance(bundle);
        capableBeanFactory.autowireBean(job);
        return job;
    }

}
