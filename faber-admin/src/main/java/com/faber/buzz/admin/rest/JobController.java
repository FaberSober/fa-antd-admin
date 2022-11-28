package com.faber.buzz.admin.rest;

import cn.hutool.core.map.MapUtil;
import com.faber.buzz.admin.biz.JobBiz;
import com.faber.common.config.annotation.IgnoreUserToken;
import com.faber.buzz.admin.entity.Job;
import com.faber.common.vo.msg.Ret;
import com.faber.common.rest.BaseController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/api/admin/job")
public class JobController extends BaseController<JobBiz, Job, Integer> {

    /**
     * 立即执行一次定时任务
     * @param id
     * @return
     */
    @GetMapping("/runOneTime/{id}")
    @ResponseBody
    public Ret<Boolean> runOneTime(@PathVariable long id) {
        baseBiz.runOneTime(id);
        return ok();
    }

    /**
     * 启动定时任务
     */
    @RequestMapping(value = "/startJob/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Boolean> startJob(@PathVariable int id) {
        baseBiz.startJob(id);
        return ok();
    }

    /**
     * 停止定时任务
     */
    @RequestMapping(value = "/endJob/{id}", method = RequestMethod.GET)
    @ResponseBody
    public Ret<Boolean> endJob(@PathVariable int id) {
        baseBiz.endJob(id);
        return ok();
    }

    /**
     * 获取cron最近5次运行时间
     */
    @RequestMapping(value = "/quartz/latest", method = RequestMethod.POST)
    @ResponseBody
    @IgnoreUserToken
    public Ret<List<String>> quartzLatest(@RequestBody Map<String, Object> params) throws ParseException  {
        String cron = MapUtil.getStr(params, "cron");
        Integer times = MapUtil.getInt(params, "times");
        List<String> list = baseBiz.quartzLatest(cron, times);
        return ok(list);
    }

}