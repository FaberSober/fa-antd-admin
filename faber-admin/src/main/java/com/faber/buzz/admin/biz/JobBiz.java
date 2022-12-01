package com.faber.buzz.admin.biz;

import cn.hutool.core.date.DateUtil;
import com.faber.buzz.admin.mapper.JobMapper;
import com.faber.config.quartz.JobTask;
import com.faber.buzz.admin.entity.Job;
import com.faber.core.web.biz.BaseBiz;
import com.faber.core.exception.BuzzException;
import com.faber.core.exception.NoDataException;
import org.quartz.CronExpression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 系统定时任务
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2019-08-21 14:48:06
 */
@Service
public class JobBiz extends BaseBiz<JobMapper, Job> {

    @Autowired
    private JobTask jobTask;

    public void runOneTime(Long id) {
        Job job = getById(id);
        if (job == null) {
            throw new NoDataException();
        }
        jobTask.runTaskImmediately(job);
    }

    public void startJob(Integer id) {
        Job job = getById(id);
        if (job == null) {
            throw new NoDataException();
        }
        jobTask.startJob(job);

        job.setStatus(true);
        updateById(job);
    }

    public void endJob(Integer id) {
        Job job = getById(id);
        if (job == null) {
            throw new NoDataException();
        }

        jobTask.remove(job);

        job.setStatus(false);
        updateById(job);
    }

    public List<String> quartzLatest(String cron, Integer times) throws ParseException  {
        if (times > 20) {
            throw new BuzzException("times should less then 20.");
        }

        CronExpression cronExpression = new CronExpression(cron);
        List<String> nextFireTimes = new ArrayList<>();
        Date date = new Date();
        for (int i = 0; i < times; i++) {
            date = cronExpression.getNextValidTimeAfter(date);
            nextFireTimes.add(DateUtil.formatDateTime(date));
        }
        return nextFireTimes;
    }

    public List<Job> getStartUpJobs() {
        return lambdaQuery().eq(Job::getStatus, true).list();
    }

}