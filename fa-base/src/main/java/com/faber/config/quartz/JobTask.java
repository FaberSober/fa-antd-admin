package com.faber.config.quartz;

import com.faber.config.quartz.vo.JobInfo;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.Date;
import java.util.HashSet;

/**
 * 定时任务类 增删改 可参考api：http://www.quartz-scheduler.org/api/2.2.1/
 * <p>
 * 任务名称 默认为 Job 类 id
 *
 * @Author: xu.pengfei
 * @Email: faberxu@gmail.com
 * @Date: 2018-08-21 9:15
 */
@Service
@Slf4j
public class JobTask {

    // 不可改成@Resource
    @Autowired
    private SchedulerFactoryBean schedulerFactoryBean;

    /**
     * true 存在 false 不存在
     *
     * @param
     * @return
     */
    public boolean checkJob(JobInfo job) {
        Scheduler scheduler = schedulerFactoryBean.getScheduler();
        TriggerKey triggerKey = TriggerKey.triggerKey(this.getJobKeyName(job), Scheduler.DEFAULT_GROUP);
        try {
            if (scheduler.checkExists(triggerKey)) {
                return true;
            }
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
        return false;
    }

    public boolean runTaskImmediately(JobInfo job) {
        Scheduler scheduler = schedulerFactoryBean.getScheduler();
        try {
            JobDetail jobDetail = this.getJobDetail(job);
            // 任务名称
            String jonKeyName = "runTaskImmediately:" + job.getId().toString() + "-" + job.getClazzPath() + "-rnd=" + new SecureRandom().nextInt(10000);
            // 触发器
            TriggerKey triggerKey = TriggerKey.triggerKey(jonKeyName, Scheduler.DEFAULT_GROUP);
            Trigger trigger = TriggerBuilder.newTrigger()
                    .withIdentity(triggerKey)
                    .startNow().build();
            scheduler.scheduleJob(jobDetail, trigger);
            // 启动
            scheduler.start();
            log.info("----- 任务[" + triggerKey.getName() + "]启动成功 ----->>>");

            // 删除任务
//            scheduler.pauseTrigger(triggerKey);
//            scheduler.unscheduleJob(triggerKey);
//            scheduler.deleteJob(JobKey.jobKey(jonKeyName, Scheduler.DEFAULT_GROUP));
//            log.info("---任务[" + triggerKey.getName() + "]删除成功-------");
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        }
        return false;
    }

    /**
     * 开启
     */
//    @Log(desc = "开启定时任务")
    public boolean startJob(JobInfo job) {
        Scheduler scheduler = schedulerFactoryBean.getScheduler();
        try {
            JobDetail jobDetail = this.getJobDetail(job);
            // 触发器
            TriggerKey triggerKey = TriggerKey.triggerKey(this.getJobKeyName(job), Scheduler.DEFAULT_GROUP);
            CronTrigger trigger = TriggerBuilder.newTrigger()
                    .withIdentity(triggerKey)
                    .withSchedule(CronScheduleBuilder.cronSchedule(job.getCron())).build();
            scheduler.scheduleJob(jobDetail, trigger);
            // 启动
            if (!scheduler.isShutdown()) {
                scheduler.start();
                log.info("----- 任务[{}]启动成功 ----->>>", triggerKey.getName());
                return true;
            } else {
                log.info("----- 任务[{}]已经运行，请勿再次启动 ----->>>", triggerKey.getName());
            }
        } catch (Exception e) {
//            throw new RuntimeException(e);
            log.error(e.getMessage(), e);
        }
        return false;
    }

    /**
     * 更新
     */
//    @Log(desc = "更新定时任务", type = Log.LOG_TYPE.UPDATE)
    public boolean updateJob(JobInfo job) {
        Scheduler scheduler = schedulerFactoryBean.getScheduler();
        String createTime = DateFormatUtils.format(new Date(), "yyyy-MM-dd HH:mm:ss");

        TriggerKey triggerKey = TriggerKey.triggerKey(this.getJobKeyName(job), Scheduler.DEFAULT_GROUP);
        try {
            if (scheduler.checkExists(triggerKey)) {
                return false;
            }

            JobKey jobKey = JobKey.jobKey(this.getJobKeyName(job), Scheduler.DEFAULT_GROUP);

            CronScheduleBuilder schedBuilder = CronScheduleBuilder.cronSchedule(job.getCron())
                    .withMisfireHandlingInstructionDoNothing();
            CronTrigger trigger = TriggerBuilder.newTrigger().withIdentity(triggerKey)
                    .withDescription(createTime).withSchedule(schedBuilder).build();
            JobDetail jobDetail = scheduler.getJobDetail(jobKey);
            HashSet<Trigger> triggerSet = new HashSet<>();
            triggerSet.add(trigger);
            scheduler.scheduleJob(jobDetail, triggerSet, true);
            log.info("----- 任务[{}]更新成功 ----->>>", triggerKey.getName());
            return true;
        } catch (SchedulerException e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    /**
     * 删除
     */
//    @Log(desc = "删除定时任务", type = Log.LOG_TYPE.DEL)
    public boolean remove(JobInfo job) {
        Scheduler scheduler = schedulerFactoryBean.getScheduler();
        TriggerKey triggerKey = TriggerKey.triggerKey(this.getJobKeyName(job), Scheduler.DEFAULT_GROUP);
        try {
            if (checkJob(job)) {
                scheduler.pauseTrigger(triggerKey);
                scheduler.unscheduleJob(triggerKey);
                scheduler.deleteJob(JobKey.jobKey(this.getJobKeyName(job), Scheduler.DEFAULT_GROUP));
                log.info("----- 任务[" + triggerKey.getName() + "]删除成功 -----xxx");
                return true;
            }
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
        return false;
    }

    private String getJobKeyName(JobInfo job) {
        return job.getId().toString() + "-" + job.getClazzPath();
    }

    private JobDetail getJobDetail(JobInfo job) throws ClassNotFoundException {
        Class clazz = Class.forName(job.getClazzPath());
        return JobBuilder.newJob(clazz)
                .usingJobData("jobId", job.getId())
                .build();
    }

}
