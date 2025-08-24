package com.faber.api.flow.manage.vo.ret;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

/**
 * 工作流任务返回对象
 */
@Data
public class FlowTaskRet implements Serializable {

    /**
     * 任务ID
     */
    private Long taskId;

    /**
     * 任务Key
     */
    private String taskKey;

    /**
     * 任务名称
     */
    private String taskName;

    /**
     * 任务类型
     */
    private Integer taskType;

    /**
     * 提醒次数
     */
    private Integer remindRepeat;

    /**
     * 任务创建时间
     */
    private Date createTime;

    /**
     * 实例ID
     */
    private Long instanceId;

    /**
     * 实例状态
     */
    private Integer instanceState;

    /**
     * 发起人
     */
    private String launchBy;

    /**
     * 发起时间
     */
    private Date launchTime;

    /**
     * 流程ID
     */
    private Long processId;

    /**
     * 流程Key
     */
    private String processKey;

    /**
     * 流程名称
     */
    private String processName;

    /**
     * 流程类型
     */
    private String processType;

}
