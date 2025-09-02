package com.faber.api.flow.manage.listener;

import java.util.List;
import java.util.function.Supplier;

import org.springframework.stereotype.Component;

import com.aizuda.bpm.engine.FlowLongEngine;
import com.aizuda.bpm.engine.core.FlowCreator;
import com.aizuda.bpm.engine.core.enums.NodeSetType;
import com.aizuda.bpm.engine.core.enums.TaskEventType;
import com.aizuda.bpm.engine.entity.FlwTask;
import com.aizuda.bpm.engine.entity.FlwTaskActor;
import com.aizuda.bpm.engine.listener.TaskListener;
import com.aizuda.bpm.engine.model.NodeModel;
import com.faber.api.flow.manage.vo.msg.FaFlowTaskMsgVo;
import com.faber.config.websocket.WsHolder;
import com.faber.core.enums.WsTypeEnum;

import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;

// 测试同步方式全局任务监听，实现 `TaskListener` 接口
@Slf4j
@Component // 注入 `SpringBoot` 容器，该方式需要被容器扫描到，或者 `@Bean` 方式注入。
public class TestTaskListener implements TaskListener {

    @Resource FlowLongEngine flowLongEngine;

    /**
     * 流程引擎监听通知
     *
     * @param eventType   事件类型
     * @param supplier    监听任务提供者
     * @param taskActors  监听任务参与者
     * @param nodeModel   当前执行节点 {@link NodeModel} 为 null 需要根据 runtimeService.getNodeModel(instanceId, nodeKey) 方法获取
     * @param flowCreator 处理人员
     * @return 通知结果 true 成功 false 失败
     */
    @Override
    public boolean notify(TaskEventType eventType, Supplier<FlwTask> supplier, List<FlwTaskActor> taskActors,
                   NodeModel nodeModel, FlowCreator flowCreator) {
        log.info("received task notify, TaskEventType: {}", eventType);

        FlwTask flwTask = supplier.get();
        if (nodeModel == null) {
            nodeModel = flowLongEngine.runtimeService().getNodeModel(flwTask.getInstanceId(), flwTask.getTaskKey());
            if (nodeModel == null) {
                return true;
            }
        }

        FaFlowTaskMsgVo taskMsg = new FaFlowTaskMsgVo();
        taskMsg.setEventType(eventType);
        if (nodeModel != null) {
            taskMsg.setTaskType(nodeModel.getType());
            taskMsg.setNodeKey(nodeModel.getNodeKey());
            taskMsg.setNodeName(nodeModel.getNodeName());

            taskMsg.setProcessName("");
            taskMsg.setProcessInstanceId(flwTask.getInstanceId());
        }

        switch (eventType) {
            case create: {
                // 发起审批，通知审核人员
                if (NodeSetType.specifyMembers.eq(nodeModel.getSetType())) {
                    log.info("处理指定成员审批");
                    if (taskActors == null || taskActors.isEmpty()) break;

                    List<String> userIds = taskActors.stream().map(FlwTaskActor::getActorId).toList();
                    WsHolder.sendMessage(userIds, WsTypeEnum.FLOW_TASK_INFO, taskMsg);
                }
            } break;
            case cc: {
                // 抄送，通知抄送人员
                log.info("处理抄送");
                WsHolder.sendMessage(WsTypeEnum.PLAIN_TEXT, nodeModel.getNodeName() + "抄送");
            } break;
            case complete: {
                // 完成，通知发起人
                log.info("处理完成");
                WsHolder.sendMessage(WsTypeEnum.PLAIN_TEXT, nodeModel.getNodeName() + "完成");
            } break;
            default:
                break;
        }
        return true;
    }

}
