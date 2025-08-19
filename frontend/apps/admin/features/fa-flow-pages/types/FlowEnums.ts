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
    /** 调用外部流程任务【办理子流程】 */
    callProcess = 5,
    /** 定时器任务 */
    timer = 6,
    /** 触发器任务 */
    trigger = 7,
    /** 并行分支 */
    parallelBranch = 8,
    /** 包容分支 */
    inclusiveBranch = 9,
    /** 转办、代理人办理完任务直接进入下一个节点 */
    transfer = 10,
    /** 委派、代理人办理完任务该任务重新归还给原处理人 */
    delegate = 11,
    /** 委派归还任务 */
    delegateReturn = 12,
    /** 代理人任务 */
    agent = 13,
    /** 代理人归还的任务 */
    agentReturn = 14,
    /** 代理人协办完成的任务 */
    agentAssist = 15,
    /** 被代理人自己完成任务 */
    agentOwn = 16,
    /** 拿回任务 */
    reclaim = 17,
    /** 待撤回历史任务 */
    withdraw = 18,
    /** 拒绝任务 */
    reject = 19,
    /** 跳转任务 */
    jump = 20,
    /** 驳回跳转 */
    rejectJump = 21,
    /** 路由跳转 */
    routeJump = 22,
    /** 路由分支 */
    routeBranch = 23,
    /** 驳回重新审批跳转 */
    reApproveJump = 24,
    /** 暂存待审 */
    saveAsDraft = 25,
    /** 自动通过 */
    autoPass = 30,
    /** 自动拒绝 */
    autoReject = 31,
  }

  export const NodeTypeMap: Record<NodeType, string> = {
    [NodeType.end]: '结束节点',
    [NodeType.major]: '主办',
    [NodeType.approval]: '审批',
    [NodeType.cc]: '抄送',
    [NodeType.conditionNode]: '条件审批',
    [NodeType.conditionBranch]: '条件分支',
    [NodeType.callProcess]: '调用外部流程任务',
    [NodeType.timer]: '定时器任务',
    [NodeType.trigger]: '触发器任务',
    [NodeType.parallelBranch]: '并行分支',
    [NodeType.inclusiveBranch]: '包容分支',
    [NodeType.transfer]: '转办',
    [NodeType.delegate]: '委派',
    [NodeType.delegateReturn]: '委派归还任务',
    [NodeType.agent]: '代理人任务',
    [NodeType.agentReturn]: '代理人归还的任务',
    [NodeType.agentAssist]: '代理人协办完成的任务',
    [NodeType.agentOwn]: '被代理人自己完成任务',
    [NodeType.reclaim]: '拿回任务',
    [NodeType.withdraw]: '待撤回历史任务',
    [NodeType.reject]: '拒绝任务',
    [NodeType.jump]: '跳转任务',
    [NodeType.rejectJump]: '驳回跳转',
    [NodeType.routeJump]: '路由跳转',
    [NodeType.routeBranch]: '路由分支',
    [NodeType.reApproveJump]: '驳回重新审批跳转',
    [NodeType.saveAsDraft]: '暂存待审',
    [NodeType.autoPass]: '自动通过',
    [NodeType.autoReject]: '自动拒绝',
  }


}

export default FlowEnums;
