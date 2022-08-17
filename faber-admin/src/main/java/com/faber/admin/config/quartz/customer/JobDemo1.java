package com.faber.admin.config.quartz.customer;

import com.faber.admin.config.quartz.BaseJob;
import lombok.extern.slf4j.Slf4j;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;

/**
 *
 */
@Slf4j
public class JobDemo1 extends BaseJob {

    @Override
    public void execute(JobExecutionContext context) throws JobExecutionException {
        log.info("{}：启动任务=======================", this.getClass().getSimpleName());
        run();
        log.info(printNextFireTime(context));
    }

    private void run() {
        log.info("{}：执行完毕=======================", this.getClass().getSimpleName());
    }

}
