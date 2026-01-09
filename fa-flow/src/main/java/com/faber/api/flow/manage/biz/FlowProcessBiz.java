package com.faber.api.flow.manage.biz;

import java.util.*;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.aizuda.bpm.engine.FlowLongEngine;
import com.aizuda.bpm.engine.core.FlowCreator;
import com.aizuda.bpm.engine.entity.FlwExtInstance;
import com.aizuda.bpm.engine.entity.FlwHisInstance;
import com.aizuda.bpm.engine.entity.FlwHisTask;
import com.aizuda.bpm.engine.entity.FlwHisTaskActor;
import com.aizuda.bpm.engine.entity.FlwInstance;
import com.aizuda.bpm.engine.entity.FlwProcess;
import com.aizuda.bpm.engine.entity.FlwTask;
import com.aizuda.bpm.engine.entity.FlwTaskActor;
import com.faber.api.flow.core.enums.FaInstanceStateEnum;
import com.faber.api.flow.manage.entity.FlowProcess;
import com.faber.api.flow.manage.mapper.FlowProcessMapper;
import com.faber.api.flow.manage.vo.req.FlowProcessStartReqVo;
import com.faber.api.flow.manage.vo.ret.FlowApprovalInfo;
import com.faber.api.flow.manage.vo.ret.FlowProcessApprovalVo;
import com.faber.core.context.BaseContextHandler;
import com.faber.core.web.biz.BaseBiz;

import jakarta.annotation.Resource;

/**
 * FLOW-流程定义
 *
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-23 14:10:49
 */
@Service
public class FlowProcessBiz extends BaseBiz<FlowProcessMapper, FlowProcess> {

    @Resource
    FlowLongEngine flowLongEngine;

    public FlowProcess getByKey(String key) {
        return lambdaQuery()
                .eq(FlowProcess::getProcessKey, key)
                .orderByDesc(FlowProcess::getUpdTime)
                .last("LIMIT 1")
                .one();
    }

    @Override
    public boolean save(FlowProcess entity) {
        // set default modelContent
        // JSONObject model = new JSONObject("""
        // {
        // "key": "",
        // "name": "",
        // "nodeConfig": {
        // "nodeName": "发起人",
        // "nodeKey": "flk1725161262899",
        // "type": 0,
        // "childNode": {
        // "nodeName": "审核人",
        // "nodeKey": "flk1724860316169",
        // "callProcess": null,
        // "type": 1,
        // "setType": 3,
        // "nodeAssigneeList": [
        // {
        // "id": "1",
        // "name": "超级管理员"
        // }
        // ],
        // "examineLevel": 1,
        // "directorLevel": 1,
        // "selectMode": 1,
        // "termAuto": false,
        // "term": 0,
        // "termMode": 1,
        // "examineMode": 2,
        // "directorMode": 0,
        // "typeOfApprove": 1,
        // "remind": false,
        // "approveSelf": 1
        // }
        // }
        // }
        // """);
        // model.set("key", entity.getProcessKey());
        // model.set("name", entity.getProcessName());

        // entity.setModelContent(model.toString());

        return super.save(entity);
    }

    public FlowProcess publish(FlowProcess flowProcess) {
        flowProcess.setProcessState(1);

        // deploy flowlong process
        Long processId = flowLongEngine.processService().deploy(
                null,
                flowProcess.getModelContent(),
                FlowCreator.of(getCurrentUserId(), BaseContextHandler.getName()),
                true,
                process -> {
                    flowProcess.setProcessVersion(process.getProcessVersion());
                });
        flowProcess.setProcessId(processId);
        this.updateById(flowProcess);

        return flowProcess;
    }

    public boolean start(FlowProcessStartReqVo reqVo) {
        FlowCreator flowCreator = FlowCreator.of(getCurrentUserId(), BaseContextHandler.getName());
        flowLongEngine.startInstanceByProcessKey(reqVo.getProcessKey(), null, flowCreator, reqVo.getArgs());

        return true;
    }
    // 流程实例-返回实例id
    public FlwInstance retInstanceStart(FlowProcessStartReqVo reqVo) {
        FlowCreator flowCreator = FlowCreator.of(getCurrentUserId(), BaseContextHandler.getName());
        Optional<FlwInstance> instance = flowLongEngine.startInstanceByProcessKey(reqVo.getProcessKey(), null, flowCreator, reqVo.getArgs());

        return instance.orElse(null);
    }

    /**
     * 根据任务ID获取当前流程审批详情，主要用于审批任务，用户根据指定任务ID查看当前流程实例详情
     * @param taskId
     * @return
     */
    public FlowApprovalInfo getApprovalInfoByTaskId(Long taskId) {
        FlwTask flwTask = flowLongEngine.queryService().getTask(taskId);
        if (flwTask == null) {
            return null;
        }
        Long instanceId = flwTask.getInstanceId();
        return getApprovalInfoById(instanceId, taskId);
    }

    /**
     * 获取当前流程审批详情
     * @param instanceId 流程实例ID
     * @return
     */
    public FlowApprovalInfo getApprovalInfoById(Long instanceId, Long taskId) {
        FlowApprovalInfo data = new FlowApprovalInfo();

        data.setInstanceId(instanceId);

        FlwHisInstance flwHisInstance = flowLongEngine.queryService().getHistInstance(instanceId);
        FlwExtInstance flwExtInstance = flowLongEngine.queryService().getExtInstance(instanceId);
        FlwProcess flwProcess = flowLongEngine.processService().getProcessById(flwHisInstance.getProcessId());
        FlowProcess flowProcess = this.getByKey(flwProcess.getProcessKey());

        // 获取当前流程实例的历史操作信息
        List<FlwHisTask> hisTasks = flowLongEngine.queryService().getHisTasksByInstanceId(instanceId).get();

        // 获取当前流程实例的当前操作信息
        List<FlwTask> tasks = flowLongEngine.queryService().getActiveTasksByInstanceId(instanceId).get();

        data.setInstanceState(FaInstanceStateEnum.fromValue(flwHisInstance.getInstanceState()));
        data.setCreateBy(flwHisInstance.getCreateBy());
        data.setCreateId(flwHisInstance.getCreateId());
        data.setCreateTime(flwHisInstance.getCreateTime());
        data.setFormContent(flwHisInstance.getVariable());
        data.setModelContent(flwExtInstance.getModelContent());

        data.setFlwProcess(flwProcess);
        data.setFlowProcess(flowProcess);

        Map<String, Object> renderNodes = new HashMap<>();

        // 渲染历史task
        for (FlwHisTask hisTask : hisTasks) {
            // renderNodes.put(hisTask.getTaskKey(), hisTask.getTaskState());
            // 这里需要考虑放1还是taskState
            renderNodes.put(hisTask.getTaskKey(), "0");
        }
        // 渲染当前task
        for (FlwTask task : tasks) {
            renderNodes.put(task.getTaskKey(), "1");
            if (taskId != null && task.getId().equals(taskId)) {
                data.setCurrentTask(task);
            }
        }

        data.setRenderNodes(renderNodes);

        // 构建流程审批历史记录
        List<FlowProcessApprovalVo> processApprovals = buildProcessApprovals(hisTasks, tasks);
        data.setProcessApprovals(processApprovals);

        return data;
    }

    /**
     * 构建流程审批历史记录列表
     * 
     * @param hisTasks 历史任务列表
     * @param tasks    当前活跃任务列表
     * @return 审批历史记录列表
     */
    private List<FlowProcessApprovalVo> buildProcessApprovals(List<FlwHisTask> hisTasks, List<FlwTask> tasks) {
        List<FlowProcessApprovalVo> approvals = new ArrayList<>();

        // 处理历史任务（已完成的审批）
        for (FlwHisTask hisTask : hisTasks) {
            FlowProcessApprovalVo approval = new FlowProcessApprovalVo();
            approval.setId(hisTask.getId());
            approval.setCreateId(hisTask.getCreateId());
            approval.setCreateBy(hisTask.getCreateBy());
            approval.setCreateTime(hisTask.getCreateTime());
            approval.setInstanceId(hisTask.getInstanceId());
            approval.setTaskId(hisTask.getId());
            approval.setTaskName(hisTask.getTaskName());
            approval.setTaskKey(hisTask.getTaskKey());
            approval.setType(1); // 1表示已完成的审批任务
            
            approvals.add(approval);
        }

        // 处理当前活跃任务（待处理的审批）
        for (FlwTask task : tasks) {
            FlowProcessApprovalVo approval = new FlowProcessApprovalVo();
            approval.setId(task.getId());
            approval.setCreateId(task.getCreateId());
            approval.setCreateBy(task.getCreateBy());
            approval.setCreateTime(task.getCreateTime());
            approval.setInstanceId(task.getInstanceId());
            approval.setTaskId(task.getId());
            approval.setTaskName(task.getTaskName());
            approval.setType(-1); // -1表示当前待处理的任务

            // 获取当前任务的审批人信息
            List<FlwTaskActor> taskActors = flowLongEngine.queryService().getTaskActorsByTaskId(task.getId());
            if (taskActors != null && !taskActors.isEmpty()) {
                FlowProcessApprovalVo.FlowProcessApprovalContentVo content = new FlowProcessApprovalVo.FlowProcessApprovalContentVo();
                List<FlowProcessApprovalVo.NodeUserVo> nodeUserList = taskActors.stream()
                        .map(actor -> {
                            FlowProcessApprovalVo.NodeUserVo nodeUser = new FlowProcessApprovalVo.NodeUserVo();
                            nodeUser.setId(actor.getActorId());
                            nodeUser.setName(actor.getActorName());
                            return nodeUser;
                        })
                        .collect(Collectors.toList());
                content.setNodeUserList(nodeUserList);
                approval.setContent(content);
            }

            approvals.add(approval);
        }

        return approvals;
    }

    // public void deployById(Integer id) {
    // FlowProcess flowProcess = this.getById(id);
    // flowProcess.setProcessState(1);

    // // deploy flowlong process
    // flowLongEngine.processService().deploy(
    // null,
    // flowProcess.getModelContent(),
    // FlowCreator.of(getCurrentUserId(), BaseContextHandler.getName()),
    // true,
    // process -> {
    // flowProcess.setProcessId(process.getId());
    // flowProcess.setProcessVersion(process.getProcessVersion());

    // this.updateById(flowProcess);
    // }
    // );
    // }

    // public void activeById(Integer id) {
    // lambdaUpdate()
    // .eq(FlowProcess::getId, id)
    // .set(FlowProcess::getProcessState, 1)
    // .update();
    // }

    // public void deactiveById(Integer id) {
    // lambdaUpdate()
    // .eq(FlowProcess::getId, id)
    // .set(FlowProcess::getProcessState, 0)
    // .update();
    // }

}