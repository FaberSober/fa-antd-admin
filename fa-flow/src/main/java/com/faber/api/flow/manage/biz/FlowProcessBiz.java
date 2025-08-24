package com.faber.api.flow.manage.biz;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.aizuda.bpm.engine.FlowLongEngine;
import com.aizuda.bpm.engine.core.FlowCreator;
import com.aizuda.bpm.engine.entity.FlwExtInstance;
import com.aizuda.bpm.engine.entity.FlwHisInstance;
import com.aizuda.bpm.engine.entity.FlwInstance;
import com.aizuda.bpm.engine.entity.FlwProcess;
import com.faber.api.flow.manage.entity.FlowProcess;
import com.faber.api.flow.manage.mapper.FlowProcessMapper;
import com.faber.api.flow.manage.vo.req.FlowProcessStartReqVo;
import com.faber.api.flow.manage.vo.ret.FlowApprovalInfo;
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

    public FlowApprovalInfo getApprovalInfoById(Long instanceId) {
        FlowApprovalInfo data = new FlowApprovalInfo();

        data.setInstanceId(instanceId);

        FlwHisInstance flwHisInstance = flowLongEngine.queryService().getHistInstance(instanceId);
        FlwExtInstance flwExtInstance = flowLongEngine.queryService().getExtInstance(instanceId);
        FlwProcess flwProcess = flowLongEngine.processService().getProcessById(flwHisInstance.getProcessId());

        data.setInstanceState(flwHisInstance.getInstanceState());
        data.setCreateBy(flwHisInstance.getCreateBy());
        data.setCreateId(flwHisInstance.getCreateId());
        data.setCreateTime(flwHisInstance.getCreateTime());
        data.setFormContent(flwHisInstance.getVariable());
        // data.setModelContent(flwExtInstance.getModelContent());

        data.setFlwProcess(flwProcess);

        Map<String, Object> renderNodes = new HashMap<>();
        data.setRenderNodes(renderNodes);

        return data;
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