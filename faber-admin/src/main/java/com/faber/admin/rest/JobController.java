package com.faber.admin.rest;

import com.faber.admin.biz.JobBiz;
import com.faber.admin.entity.Job;
import com.faber.common.msg.ObjectRestResponse;
import com.faber.common.rest.BaseController;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/api/admin/job")
public class JobController extends BaseController<JobBiz, Job> {

    @GetMapping("/{id}/runOneTime")
    @ResponseBody
    @ApiOperation(value = "立即执行一次定时任务", notes = "立即执行一次定时任务")
    public ObjectRestResponse runOneTime(@ApiParam(required = true, name = "id", value = "定时任务ID") @PathVariable long id) {
        baseBiz.runOneTime(id);
        return new ObjectRestResponse<>().rel(true);
    }

    /**
     * 启动定时任务
     */
    @RequestMapping(value = "/{id}/startJob", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse startJob(@PathVariable int id) {
        baseBiz.startJob(id);
        return new ObjectRestResponse<>().rel(true);
    }

    /**
     * 停止定时任务
     */
    @RequestMapping(value = "/{id}/endJob", method = RequestMethod.GET)
    @ResponseBody
    public ObjectRestResponse endJob(@PathVariable int id) {
        baseBiz.endJob(id);
        return new ObjectRestResponse<>().rel(true);
    }

}