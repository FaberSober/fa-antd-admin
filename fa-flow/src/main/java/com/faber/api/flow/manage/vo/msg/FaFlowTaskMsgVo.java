package com.faber.api.flow.manage.vo.msg;

import java.io.Serializable;

import com.aizuda.bpm.engine.core.enums.NodeSetType;
import com.aizuda.bpm.engine.core.enums.TaskEventType;
import com.aizuda.bpm.engine.core.enums.TaskType;

import lombok.Data;

@Data
public class FaFlowTaskMsgVo implements Serializable {
    
    /**
     * 消息标题
     */
    private String title;
    /**
     * 审核人类型 {@link NodeSetType}
     * <p>
     * 1，指定成员 2，主管 3，角色 4，发起人自选 5，发起人自己 6，连续多级主管 7，部门 8，指定候选人
     * </p>
     */
    private TaskEventType eventType;
    /**
     * 节点名称
     */
    private String nodeName;
    /**
     * 节点 key
     */
    private String nodeKey;
    
    /**
     * 节点类型 {@link TaskType}
     * <p>
     * -1，结束节点 0，发起人 1，审批人 2，抄送人 3，条件审批 4，条件分支 5，办理子流程 6，定时器任务 7，触发器任务 8，并发分支 9，包容分支
     * </p>
     * <p>
     * 23，路由分支 30，自动通过 31，自动拒绝
     * </p>
     */
    private Integer taskType;

    private String processName;
    private Long processInstanceId;

}
