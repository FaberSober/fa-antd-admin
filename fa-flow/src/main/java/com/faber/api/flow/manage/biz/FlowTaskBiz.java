package com.faber.api.flow.manage.biz;

import org.springframework.stereotype.Service;

import com.aizuda.bpm.engine.FlowLongEngine;
import com.aizuda.bpm.engine.core.FlowCreator;
import com.aizuda.bpm.engine.entity.FlwTask;
import com.faber.api.flow.manage.mapper.FlowTaskFaMapper;
import com.faber.api.flow.manage.vo.req.FlowTaskPageReqVo;
import com.faber.api.flow.manage.vo.ret.FlowTaskRet;
import com.faber.api.flow.manage.vo.ret.FlowTaskCountRet;
import com.faber.api.flow.manage.vo.ret.FlowHisInstanceRet;
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

    /**
     * 查询个人名下待审批的task列表
     */
    public TableRet<FlowTaskRet> pagePendingApproval(BasePageQuery<FlowTaskPageReqVo> query) {
        query.getQuery().setActorId(BaseContextHandler.getUserId());
        query.getQuery().setActorType(0);
        PageInfo<FlowTaskRet> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
                .doSelectPageInfo(() -> flowTaskMapper.queryTask(query.getQuery(), query.getSorter()));
        return new TableRet<>(info);
    }

    /**
     * 查询我申请的流程task列表
     */
    public TableRet<FlowTaskRet> pageMyApplications(BasePageQuery<FlowTaskPageReqVo> query) {
        query.getQuery().setCreateId(BaseContextHandler.getUserId());
        PageInfo<FlowTaskRet> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
                .doSelectPageInfo(() -> flowTaskMapper.queryHisTask(query.getQuery(), query.getSorter()));
        return new TableRet<>(info);
    }

    /**
     * 查询历史流程实例列表
     */
    public TableRet<FlowHisInstanceRet> pageHisInstances(BasePageQuery<FlowTaskPageReqVo> query) {
        // 如果需要查询当前用户的历史流程，可以设置 createId
        // query.getQuery().setCreateId(BaseContextHandler.getUserId());
        
        PageInfo<FlowHisInstanceRet> info = PageHelper.startPage(query.getCurrent(), query.getPageSize())
                .doSelectPageInfo(() -> flowTaskMapper.queryHisInstance(query.getQuery(), query.getSorter()));
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
    
    /**
     * 查询我的流程任务数量
     */
    public FlowTaskCountRet getMyTaskCount() {
        String currentUserId = BaseContextHandler.getUserId();
        
        FlowTaskCountRet countRet = new FlowTaskCountRet();
        
        // 查询待审批任务数量
        Integer pendingCount = flowTaskMapper.countPendingApproval(currentUserId);
        countRet.setPendingApprovalCount(pendingCount != null ? pendingCount : 0);
        
        // 查询我的申请数量
        Integer myAppCount = flowTaskMapper.countMyApplications(currentUserId);
        countRet.setMyApplicationCount(myAppCount != null ? myAppCount : 0);
        
        // 查询我收到的任务数量
        Integer myReceivedCount = flowTaskMapper.countMyReceived(currentUserId);
        countRet.setMyReceivedCount(myReceivedCount != null ? myReceivedCount : 0);
        
        // 查询认领任务数量
        Integer claimCount = flowTaskMapper.countClaimTasks(currentUserId);
        countRet.setClaimTaskCount(claimCount != null ? claimCount : 0);
        
        // 查询已审批任务数量
        Integer auditedCount = flowTaskMapper.countAudited(currentUserId);
        countRet.setAuditedCount(auditedCount != null ? auditedCount : 0);
        
        return countRet;
    }

}
