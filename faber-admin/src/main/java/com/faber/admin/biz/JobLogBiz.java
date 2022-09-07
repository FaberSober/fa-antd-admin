package com.faber.admin.biz;

import org.springframework.stereotype.Service;

import com.faber.admin.entity.JobLog;
import com.faber.admin.mapper.JobLogMapper;
import com.faber.common.biz.BaseBiz;

/**
 * BASE-系统定时任务-执行日志
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-07 16:03:51
 */
@Service
public class JobLogBiz extends BaseBiz<JobLogMapper,JobLog> {
}