package com.faber.admin.config.quartz;

import org.quartz.Job;
import org.quartz.JobExecutionContext;

import java.text.SimpleDateFormat;

public abstract class BaseJob implements Job {

    protected String printNextFireTime(JobExecutionContext context) {
        if (context.getNextFireTime() != null) {
            return this.getClass().getSimpleName() + "：下次执行时间=====" +
                    new SimpleDateFormat("yyyy-MM-dd HH:mm:ss")
                            .format(context.getNextFireTime()) + "=======================";
        }
        return this.getClass().getSimpleName() + "：单次执行结束=======================";
    }

}
