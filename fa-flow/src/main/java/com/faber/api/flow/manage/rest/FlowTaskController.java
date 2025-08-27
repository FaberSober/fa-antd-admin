package com.faber.api.flow.manage.rest;

import java.util.Map;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.faber.api.flow.manage.biz.FlowTaskBiz;
import com.faber.api.flow.manage.vo.req.FlowTaskPageReqVo;
import com.faber.api.flow.manage.vo.ret.FlowTaskRet;
import com.faber.api.flow.manage.vo.ret.FlowTaskCountRet;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.utils.BaseResHandler;
import com.faber.core.vo.msg.Ret;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.BasePageQuery;

import cn.hutool.core.map.MapUtil;
import jakarta.annotation.Resource;

@FaLogBiz("FLOW-流程定义")
@RestController
@RequestMapping("/api/flow/manage/flowTask")
public class FlowTaskController extends BaseResHandler {

    @Resource
    FlowTaskBiz flowTaskBiz;

    @FaLogOpr(value = "待审批", crud = LogCrudEnum.R)
    @RequestMapping(value = "/pagePendingApproval", method = RequestMethod.POST)
    @ResponseBody
    public TableRet<FlowTaskRet> pagePendingApproval(@RequestBody BasePageQuery<FlowTaskPageReqVo> query) {
        return flowTaskBiz.pagePendingApproval(query);
    }

    @FaLogOpr(value = "我申请的流程", crud = LogCrudEnum.R)
    @RequestMapping(value = "/pageMyApplications", method = RequestMethod.POST)
    @ResponseBody
    public TableRet<FlowTaskRet> pageMyApplications(@RequestBody BasePageQuery<FlowTaskPageReqVo> query) {
        return flowTaskBiz.pageMyApplications(query);
    }

    @FaLogOpr(value = "同意流程", crud = LogCrudEnum.C)
    @RequestMapping(value = "/pass", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> pass(@RequestBody Map<String, Object> query) {
        Long taskId = MapUtil.getLong(query, "taskId");
        flowTaskBiz.pass(taskId);
        return ok();
    }

    @FaLogOpr(value = "拒绝流程", crud = LogCrudEnum.C)
    @RequestMapping(value = "/reject", method = RequestMethod.POST)
    @ResponseBody
    public Ret<Boolean> reject(@RequestBody Map<String, Object> query) {
        Long taskId = MapUtil.getLong(query, "taskId");
        flowTaskBiz.reject(taskId);
        return ok();
    }
    
    @FaLogOpr(value = "查询我的流程任务数量", crud = LogCrudEnum.R)
    @RequestMapping(value = "/getMyTaskCount", method = RequestMethod.GET)
    @ResponseBody
    public Ret<FlowTaskCountRet> getMyTaskCount() {
        return ok(flowTaskBiz.getMyTaskCount());
    }

}
