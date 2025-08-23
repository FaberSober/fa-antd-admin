import FlwEnums from "./FlwEnums";

namespace Flw {

  /** FLOW-Process */
  export interface ProcessModel {
    /** 节点名称 */
    name: string;
    /** 流程 key */
    key: string;
    /** 实例地址 */
    instanceUrl?: string;
    /** 节点信息 */
    nodeConfig: Node;
    /** 扩展配置 */
    extendConfig?: Record<string, any>;
  }

  export interface FlowActor {
    id: string;
    name: string;
  }

  /** FLOW-Node */
  export interface Node extends Record<any, any> {
    /**
     * node type: -1，结束节点 0，发起人 1，审批人 2，抄送人 3，条件审批 4，条件分支 5，办理子流程 6，定时器任务 7，触发器任务 8，并发分支 9，包容分支
     */
    type: FlwEnums.NodeType;
    /**
     * 审核人类型: 1，指定成员 2，主管 3，角色 4，发起人自选 5，发起人自己 6，连续多级主管 7，部门 8，指定候选人
     */
    setType?: FlwEnums.NodeSetType;
    /** 节点名称 */
    nodeName?: string;
    /** 节点 key */
    nodeKey?: string;
    /** 调用外部流程 */
    callProcess?: string;
    /** 是否异步调用【例如：子流程该参数为 true 则为异步子流程】 */
    callAsync?: boolean;
    /** 任务关联的表单url */
    actionUrl?: string;
    /** 审核分配到任务的处理者，过 setType 区分个人角色或部门 */
    nodeAssigneeList?: FlowActor[];
    /** 指定主管层级 */
    examineLevel?: number;
    /**
     * 多人审批时审批方式
     * 0，发起 1，按顺序依次审批 2，会签 (可同时审批，每个人必须审批通过) 3，或签 (有一人审批通过即可) 4，票签 (总权重大于 50% 表示通过)
     */
    examineMode?: number;
    /** 分组（角色、部门）审批策略，默认 0，认领审批 1，全部人员参与审批 */
    groupStrategy?: number;
    /** 自定义连续主管审批层级 */
    directorLevel?: number;
    /**
     * 连续主管审批方式
     * 0，直到最上级主管 1，自定义审批终点
     */
    directorMode?: number;
    /**
     * 发起人自选类型
     * 1，自选一个人 2，自选多个人 3，自选角色
     */
    selectMode?: number;
    /** 超时自动审批 */
    termAuto?: boolean;
    /** 审批期限（小时） */
    term?: number;
    /**
     * 审批期限超时后执行类型
     * 0，自动通过 1，自动拒绝
     */
    termMode?: number;
    /**
     * 审批类型
     * 1，人工审批 2，自动通过 3，自动拒绝
     */
    typeOfApprove?: number;
    /** 通过权重（ 所有分配任务权重之和大于该值即通过，默认 50 ） */
    passWeight?: number;
    /**
     * 驳回策略
     * 1，驳回到发起人，2，驳回到上一节点，3，驳回到指定节点 4，终止审批流程 5，驳回到模型父节点
     */
    rejectStrategy?: number;
    /**
     * 驳回重新审批策略
     * 1，继续往下执行 2，回到上一个节点
     */
    rejectStart?: number;
    /** 条件节点列表 */
    conditionNodes?: ConditionNode[];
    /** 并行节点 */
    parallelNodes?: Node[];
    /** 包容节点 */
    inclusiveNodes?: ConditionNode[];
    /** 路由节点 */
    routeNodes?: ConditionNode[];
    /** 审批提醒 */
    remind?: boolean;
    /** 允许发起人自选抄送人 */
    allowSelection?: boolean;
    /** 允许转交 */
    allowTransfer?: boolean;
    /** 允许加签/减签 */
    allowAppendNode?: boolean;
    /** 允许回退 */
    allowRollback?: boolean;
    /** 允许审批节点手动创建抄送任务 */
    allowCc?: boolean;
    /**
     * 审批人与提交人为同一人时
     * 0，由发起人对自己审批 1，自动跳过 2，转交给直接上级审批 3，转交给部门负责人审批
     */
    approveSelf?: number;
    /** 扩展配置，用于存储表单权限、操作权限 等控制参数配置 */
    extendConfig?: Record<string, any>;
    /** 子节点 */
    childNode?: Node;
    /** 父节点 */
    parentNode?: Node;
    /**
     * 触发器类型
     * 1，立即执行 2，延迟执行
     */
    triggerType?: number;
    /**
     * 延时处理类型
     * 1，固定时长 2，自动计算
     */
    delayType?: number;
  }

  export interface ConditionNode {
    /** 节点名称 */
    nodeName: string;
    /**
     * 节点 key
     * 如果为路由分支，格式 route:targetNodeKey
     */
    nodeKey: string;
    /** 节点类型 */
    type: number;
    /** 优先级 */
    priorityLevel: number;
    /**
     * 节点条件表达式列表
     * 外层 Array 为条件组或关系、内层 Array 为具体条件且关系
     */
    conditionList: Array<Array<NodeExpression>>;
    /** 子节点 */
    childNode?: Node;
  }

  export interface NodeExpression {
    /** 名称 */
    label?: string;
    /** 属性 */
    field?: string;
    /** 操作 */
    operator?: string;
    /** 内容 */
    value?: string;
    /** 条件类型 */
    type?: string;
  }

}

export default Flw;
