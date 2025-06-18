package com.faber.api.base.admin.rest;

import cn.hutool.core.map.MapUtil;
import com.faber.api.base.admin.biz.JobBiz;
import com.faber.api.base.admin.entity.Job;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.config.annotation.IgnoreUserToken;
import com.faber.core.vo.utils.DictOption;
import com.faber.core.vo.msg.Ret;
import com.faber.core.web.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

@FaLogBiz("定时任务")
@Controller
@RequestMapping("/api/base/admin/job")
public class JobController extends BaseController<JobBiz, Job, Integer> {

    @FaLogOpr("立即执行")
    @GetMapping("/runOneTime/{id}")
    @ResponseBody
    public Ret<Boolean> runOneTime(@PathVariable long id) {
        baseBiz.runOneTime(id);
        return ok();
    }

    @FaLogOpr("启动")
    @RequestMapping(value = "/startJob/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Boolean> startJob(@PathVariable int id) {
        baseBiz.startJob(id);
        return ok();
    }

    @FaLogOpr("停止")
    @RequestMapping(value = "/endJob/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Boolean> endJob(@PathVariable int id) {
        baseBiz.endJob(id);
        return ok();
    }

    @FaLogOpr("获取cron最近5次运行时间")
    @RequestMapping(value = "/quartz/latest", method = RequestMethod.POST)
    @ResponseBody
    @IgnoreUserToken
    public Ret<List<String>> quartzLatest(@RequestBody Map<String, Object> params) throws ParseException  {
        String cron = MapUtil.getStr(params, "cron");
        Integer times = MapUtil.getInt(params, "times");
        List<String> list = baseBiz.quartzLatest(cron, times);
        return ok(list);
    }

    @FaLogOpr("全部任务")
    @GetMapping("/getAllJobs")
    @ResponseBody
    public Ret<List<DictOption<String>>> getAllJobs() {
        List<DictOption<String>> list = baseBiz.getAllJobs();
        return ok(list);
    }

}