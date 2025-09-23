package com.faber.api.flow.demo.flow;

import java.util.Collections;
import java.util.List;

import org.springframework.stereotype.Component;

import com.aizuda.bpm.engine.core.Execution;
import com.aizuda.bpm.engine.entity.FlwTaskActor;
import com.aizuda.bpm.engine.model.NodeModel;
import com.faber.api.flow.core.annotation.FaTaskActorAssign;

/**
 * 测试流程代码接口指定task处理人
 */
@Component
public class DemoLeaveTaskActorProvider {
    
    @FaTaskActorAssign(desc = "测试指定请假task任务处理人")
    public List<FlwTaskActor> getTaskActorCase1(NodeModel nodeModel, Execution execution) {
        // 这里可以是根据流程节点，自定义具体业务的处理人
        FlwTaskActor actor = FlwTaskActor.ofUser(null, "1", "超级管理员");
        return Collections.singletonList(actor);
    }

}
