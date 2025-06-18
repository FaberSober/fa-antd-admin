package com.faber.config.runner;

import com.faber.api.base.admin.biz.JobBiz;
import com.faber.api.base.admin.entity.Job;
import com.faber.config.quartz.JobTask;
import com.faber.core.constant.FaSetting;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;

import jakarta.annotation.Resource;
import java.util.List;

/**
 * 启动执行器：应用启动后，扫描数据库中已经开启的定时任务
 * @author xu.pengfei
 * @create 2022/09/29
 */
@Order(value=10)
@Slf4j
@Configuration
public class DbJobsStartRunner implements CommandLineRunner {

    @Resource
    private JobBiz jobBiz;

    @Resource
    private JobTask jobTask;

    @Resource
    private FaSetting faSetting;

    @Override
    public void run(String... args) throws Exception {
        if (!faSetting.getConfig().getStartJobsOnBoot()) {
            log.info("------------ 系统设置开机启动不执行：扫描数据库中已经开启的定时任务 ------------");
            return;
        }

        log.info("------------ 系统设置开机启动执行：扫描数据库中已经开启的定时任务 BEGIN ------------");
        List<Job> jobList = jobBiz.getStartUpJobs();

        jobList.forEach(job -> {
            log.info("----- 任务[{}-{}]系统 init -- 开始启动 ----->>>", job.getId(), job.getJobName());
            jobTask.startJob(job);
        });

        if (jobList.size() == 0) {
            log.info("------------ 数据库暂无启动的任务 ------------");
        } else {
            log.info("------------ 任务启动完毕 ------------");
        }
        log.info("------------ 系统设置开机启动执行：扫描数据库中已经开启的定时任务 END ------------");
    }

}
