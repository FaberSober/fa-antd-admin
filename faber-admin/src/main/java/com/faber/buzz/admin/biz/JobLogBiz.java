package com.faber.buzz.admin.biz;

import com.faber.buzz.admin.entity.JobLog;
import com.faber.buzz.admin.mapper.JobLogMapper;
import com.faber.common.biz.BaseBiz;
import org.springframework.stereotype.Service;

/**
 * BASE-系统定时任务-执行日志
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-07 16:03:51
 */
@Service
public class JobLogBiz extends BaseBiz<JobLogMapper, JobLog> {
}