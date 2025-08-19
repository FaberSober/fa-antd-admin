namespace FlowEnums {

  // ------------------------------------ Flow ------------------------------------
  /**
   * {@link com.aizuda.bpm.engine.core.enums.TaskType}
   */
  export enum NodeType {
    /** 结束节点 */
    end = -1,
    /** 主办 */
    major = 0,
    /** 审批 */
    approval = 1,
    /** 抄送 */
    cc = 2,
    /** 条件审批 */
    conditionNode = 3,
    /** 条件分支 */
    conditionBranch = 4,
  }

  export const NodeTypeMap = {
    [NodeType.end]: '结束节点',
    [NodeType.major]: '主办',
    [NodeType.approval]: '审批',
    [NodeType.cc]: '抄送',
    [NodeType.conditionNode]: '条件审批',
    [NodeType.conditionBranch]: '条件分支',
  }

}

export default FlowEnums;
