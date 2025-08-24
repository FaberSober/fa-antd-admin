package com.faber.api.flow.manage.rest;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.faber.api.flow.manage.biz.FlowTaskBiz;
import com.faber.api.flow.manage.vo.req.FlowTaskPageReqVo;
import com.faber.api.flow.manage.vo.ret.FlowTaskRet;
import com.faber.core.annotation.FaLogBiz;
import com.faber.core.annotation.FaLogOpr;
import com.faber.core.enums.LogCrudEnum;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.BasePageQuery;

import jakarta.annotation.Resource;

@FaLogBiz("FLOW-流程定义")
@RestController
@RequestMapping("/api/flow/manage/flowTask")
public class FlowTaskController {

    @Resource
    FlowTaskBiz flowTaskBiz;

    @FaLogOpr(value = "待审批", crud = LogCrudEnum.C)
    @RequestMapping(value = "/pagePendingApproval", method = RequestMethod.POST)
    @ResponseBody
    public TableRet<FlowTaskRet> pagePendingApproval(@RequestBody BasePageQuery<FlowTaskPageReqVo> query) {
        return flowTaskBiz.pagePendingApproval(query);
    }

}
