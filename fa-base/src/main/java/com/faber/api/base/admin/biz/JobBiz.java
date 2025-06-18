package com.faber.api.base.admin.biz;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.ClassUtil;
import com.faber.api.base.admin.entity.Job;
import com.faber.api.base.admin.mapper.JobMapper;
import com.faber.config.quartz.JobTask;
import com.faber.core.annotation.FaJob;
import com.faber.core.exception.BuzzException;
import com.faber.core.exception.NoDataException;
import com.faber.core.vo.utils.DictOption;
import com.faber.core.web.biz.BaseBiz;
import org.quartz.CronExpression;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

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

    public List<DictOption<String>> getAllJobs() {
        return ClassUtil.scanPackageByAnnotation("com.faber", FaJob.class)
                .stream()
                .map(clazz -> new DictOption<String>(clazz.getName(), clazz.getAnnotation(FaJob.class).value()))
                .sorted(Comparator.comparing(DictOption::getLabel))
                .collect(Collectors.toList());
    }

}