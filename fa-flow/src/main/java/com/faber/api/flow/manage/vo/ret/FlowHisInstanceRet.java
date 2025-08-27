package com.faber.api.flow.manage.vo.ret;

import java.io.Serializable;
import java.util.Date;

import lombok.Data;

/**
 * 历史流程实例返回对象
 */
@Data
public class FlowHisInstanceRet implements Serializable {

    /**
     * 流程ID
     */
    private String processId;

    /**
     * 流程名称
     */
    private String processName;

    /**
     * 流程类型
     */
    private String processType;

    /**
     * 当前节点名称
     */
    private String currentNodeName;

    /**
     * 当前节点Key
     */
    private String currentNodeKey;

    /**
     * 实例ID
     */
    private String instanceId;

    /**
     * 实例状态
     */
    private Integer instanceState;

    /**
     * 创建人ID
     */
    private String createId;

    /**
     * 创建人名称
     */
    private String createBy;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 结束时间
     */
    private Date endTime;

    /**
     * 处理耗时（毫秒）
     */
    private String duration;

}