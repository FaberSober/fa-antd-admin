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
    nodeName?: string;
    nodeKey?: string;
    setType?: number;
    examineLevel?: number;
    examineMode?: number;
    directorLevel?: number;
    directorMode?: number;
    selectMode?: number;
    termAuto?: boolean;
    term?: number;
    termMode?: number;
    typeOfApprove?: number;
    rejectStrategy?: 2,
    rejectStart?: number;
    remind?: boolean;
    allowTransfer?: boolean;
    allowAppendNode?: boolean;
    allowRollback?: boolean;
    approveSelf?: number;
    parallelNodes?: Node[];
    childNode?: Node;
    nodeAssigneeList?: FlowActor[];
  }


}

export default Flow;
