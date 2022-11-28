package com.faber.buzz.admin.rest;

import com.faber.buzz.admin.biz.JobLogBiz;
import com.faber.buzz.admin.entity.JobLog;
import com.faber.common.web.rest.BaseController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * BASE-系统定时任务-执行日志
 *
 * @author Farando
 * @email faberxu@gmail.com
 * @date 2022-09-07 16:03:51
 */
@RestController
@RequestMapping("/api/admin/jobLog")
public class JobLogController extends BaseController<JobLogBiz, JobLog, Integer> {

}