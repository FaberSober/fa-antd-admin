package com.faber.admin.config.bootlistener;

import com.faber.admin.config.quartz.JobTask;
import com.faber.admin.entity.Job;
import com.faber.admin.mapper.JobMapper;
import com.faber.common.util.SpringUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;

import javax.annotation.Resource;
import java.util.List;

/**
 * 启动数据库中已经设定为 启动状态(status:true)的任务 项目启动时init
 *
 * @Author: xu.pengfei
 * @Email: faberxu@gmail.com
 * @Date: 2018-08-21 9:11
 */
@Configuration
@Slf4j
public class DataSourceJobThread extends Thread {

    @Resource
    private JobMapper jobMapper;

    @Override
    public void run() {
        try {
            Thread.sleep(1000);
            log.info("------------线程启动------------");
            JobTask jobTask = SpringUtil.getBean("jobTask");

            List<Job> jobList = jobMapper.selectStartUpJobs();

            jobList.forEach(job -> {
                log.info("==> 任务[{}-{}]系统 init == 开始启动 ==>>>", job.getId(), job.getJobName());
                jobTask.startJob(job);
            });

            if (jobList.size() == 0) {
                log.info("------------数据库暂无启动的任务------------");
            } else {
                log.info("------------任务启动完毕------------");
            }
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
