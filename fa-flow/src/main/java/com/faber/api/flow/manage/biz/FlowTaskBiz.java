package com.faber.api.flow.manage.biz;

import org.springframework.stereotype.Service;

import com.aizuda.bpm.engine.FlowLongEngine;
import com.aizuda.bpm.engine.core.FlowCreator;
import com.aizuda.bpm.engine.entity.FlwTask;
import com.faber.api.flow.manage.mapper.FlowTaskFaMapper;
import com.faber.api.flow.manage.vo.req.FlowTaskPageReqVo;
import com.faber.api.flow.manage.vo.ret.FlowTaskRet;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.vo.msg.TableRet;
import com.faber.core.vo.query.BasePageQuery;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import jakarta.annotation.Resource;

@Service
public class FlowTaskBiz {

    @Resource
    private FlowTaskFaMapper flowTaskMapper;

    @Resource
    FlowLongEngine flowLongEngine;

    public TableRet<FlowTaskRet> pagePendingApproval(BasePageQuery<FlowTaskPageReqVo> query) {
        query.getQuery().setActorId(BaseContextHandler.getUserId());
        PageInfo<FlowTaskRet> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
                .doSelectPageInfo(() -> flowTaskMapper.queryTask(query.getQuery(), query.getSorter()));
        return new TableRet<>(info);
    }

    public void pass(Long taskId) {
        FlowCreator flowCreator = FlowCreator.of(BaseContextHandler.getUserId(), BaseContextHandler.getName());
        flowLongEngine.executeTask(taskId, flowCreator);
    }

    public void reject(Long taskId) {
        FlowCreator flowCreator = FlowCreator.of(BaseContextHandler.getUserId(), BaseContextHandler.getName());
        FlwTask flwTask = flowLongEngine.queryService().getTask(taskId);
        flowLongEngine.executeRejectTask(flwTask, null, flowCreator, null, true);
    }

}
