package com.faber.api.flow.manage.vo.ret;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import lombok.Data;

/**
 * 流程审批历史记录VO
 * 
 * @author xu.pengfei
 * @email 1508075252@qq.com
 * @date 2025-08-31
 */
@Data
public class FlowProcessApprovalVo implements Serializable {

    /**
     * 任务ID
     */
    private Long id;

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
    private Long createTime;

    /**
     * 流程实例ID
     */
    private Long instanceId;

    /**
     * 任务ID
     */
    private Long taskId;

    /**
     * 任务名称
     */
    private String taskName;

    /**
     * 任务Key
     */
    private String taskKey;

    /**
     * 任务类型/状态
     * 1: 已完成的审批任务
     * -1: 当前待处理的任务
     */
    private Integer type;

    /**
     * 扩展内容，用于存储待处理任务的审批人信息
     */
    private FlowProcessApprovalContentVo content;

    @Data
    public static class FlowProcessApprovalContentVo implements Serializable {
        /**
         * 节点用户列表
         */
        private List<NodeUserVo> nodeUserList;
    }

    @Data
    public static class NodeUserVo implements Serializable {
        /**
         * 用户ID
         */
        private String id;

        /**
         * 用户名称
         */
        private String name;
    }
}