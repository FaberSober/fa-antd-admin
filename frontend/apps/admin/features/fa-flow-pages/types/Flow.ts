import FlowEnums from "./FlowEnums";

namespace Flow {

  export interface FlowActor {
    id: string;
    name: string;
  }

  /** STORE-库 */
  export interface Node extends Record<any, any> {
    /**
     * node type: -1，结束节点 0，发起人 1，审批人 2，抄送人 3，条件审批 4，条件分支 5，办理子流程 6，定时器任务 7，触发器任务 8，并发分支 9，包容分支
     */
    type: FlowEnums.NodeType;
    /**
     * 审核人类型: 1，指定成员 2，主管 3，角色 4，发起人自选 5，发起人自己 6，连续多级主管 7，部门 8，指定候选人
     */
    setType: FlowEnums.NodeSetType;
    nodeName?: string;
    nodeKey?: string;
    callProcess?: string;
    callAsync?: boolean;
    actionUrl?: string;
    nodeAssigneeList?: FlowActor[];
    examineLevel?: number;
    examineMode?: number;
    groupStrategy?: number;
    directorLevel?: number;
    directorMode?: number;
    selectMode?: number;
    termAuto?: boolean;
    term?: number;
    termMode?: number;
    typeOfApprove?: number;
    passWeight?: number;
    rejectStrategy?: number;
    rejectStart?: number;
    conditionNodes?: ConditionNode[];
    parallelNodes?: Node[];
    inclusiveNodes?: ConditionNode[];
    routeNodes?: ConditionNode[];
    remind?: boolean;
    allowSelection?: boolean;
    allowTransfer?: boolean;
    allowAppendNode?: boolean;
    allowRollback?: boolean;
    allowCc?: boolean;
    approveSelf?: number;
    extendConfig?: Record<string, any>;
    childNode?: Node;
    parentNode?: Node;
    triggerType?: number;
    delayType?: number;
  }

  export interface ConditionNode {
    nodeName?: string;
    nodeKey?: string;
    type?: number;
    priorityLevel?: number;
    conditionList?: Array<Array<NodeExpression>>;
    childNode?: Node;
  }

  export interface NodeExpression {
    label?: string;
    field?: string;
    operator?: string;
    value?: string;
    type?: string;
  }

}

export default Flow;
