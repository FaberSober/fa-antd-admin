package com.faber.admin.biz;

import com.faber.admin.mapper.JobMapper;
import com.faber.admin.config.quartz.JobTask;
import com.faber.admin.entity.Job;
import com.faber.common.bean.BaseOprEntity;
import com.faber.common.biz.BaseBiz;
import com.faber.common.exception.NoDataException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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

    @Override
    public void insertSelective(Job entity) {
        entity.setStatus(BaseOprEntity.Bool.FALSE); // 新增任务初始未启动
        super.insertSelective(entity);
    }

    @Override
    public void deleteById(Object id) {
        super.logicDeleteById(id);
    }

    public void runOneTime(Long id) {
        Job job = mapper.selectByPrimaryKey(id);
        super.checkBeanValid(job);

        jobTask.runTaskImmediately(job);
    }

    public void startJob(Integer id) {
        Job job = mapper.selectByPrimaryKey(id);
        if (job == null) {
            throw new NoDataException();
        }
        jobTask.startJob(job);
        job.setStatus(BaseOprEntity.Bool.TRUE);
        mapper.updateByPrimaryKeySelective(job);
    }

    public void endJob(Integer id) {
        Job job = mapper.selectByPrimaryKey(id);
        if (job == null) {
            throw new NoDataException();
        }
        jobTask.remove(job);
        job.setStatus(BaseOprEntity.Bool.FALSE);
        mapper.updateByPrimaryKeySelective(job);
    }

}