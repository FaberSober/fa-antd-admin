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

  /**
   * {@link com.aizuda.bpm.engine.core.enums.TaskState}
   */
  export enum TaskState {
    /** 活动 */
    active = 0,
    /** 跳转 */
    jump = 1,
    /** 完成 */
    complete = 2,
    /** 拒绝 */
    reject = 3,
    /** 撤销审批 */
    revoke = 4,
    /** 超时 */
    timeout = 5,
    /** 终止 */
    terminate = 6,
    /** 驳回终止 */
    rejectEnd = 7,
    /** 自动完成 */
    autoComplete = 8,
    /** 自动驳回 */
    autoReject = 9,
    /** 自动跳转 */
    autoJump = 10,
    /** 驳回跳转 */
    rejectJump = 11,
    /** 驳回重新审批跳转 */
    reApproveJump = 12,
    /** 路由跳转 */
    routeJump = 13,
  }

  export const TaskStateMap: Record<TaskState, string> = {
    [TaskState.active]: '活动',
    [TaskState.jump]: '跳转',
    [TaskState.complete]: '完成',
    [TaskState.reject]: '拒绝',
    [TaskState.revoke]: '撤销审批',
    [TaskState.timeout]: '超时',
    [TaskState.terminate]: '终止',
    [TaskState.rejectEnd]: '驳回终止',
    [TaskState.autoComplete]: '自动完成',
    [TaskState.autoReject]: '自动驳回',
    [TaskState.autoJump]: '自动跳转',
    [TaskState.rejectJump]: '驳回跳转',
    [TaskState.reApproveJump]: '驳回重新审批跳转',
    [TaskState.routeJump]: '路由跳转',
  }

  /**
   * {@link com.aizuda.bpm.engine.core.enums.NodeSetType}
   */
  export enum NodeSetType {
    /** 指定成员 */
    specifyMembers = 1,
    /** 主管 */
    supervisor = 2,
    /** 角色 */
    role = 3,
    /** 发起人自选 */
    initiatorSelected = 4,
    /** 发起人自己 */
    initiatorThemselves = 5,
    /** 连续多级主管 */
    multiLevelSupervisors = 6,
    /** 部门 */
    department = 7,
    /** 指定候选人 */
    designatedCandidate = 8,
  }

  export const NodeSetTypeMap: Record<NodeSetType, string> = {
    [NodeSetType.specifyMembers]: '指定成员',
    [NodeSetType.supervisor]: '主管',
    [NodeSetType.role]: '角色',
    [NodeSetType.initiatorSelected]: '发起人自选',
    [NodeSetType.initiatorThemselves]: '发起人自己',
    [NodeSetType.multiLevelSupervisors]: '连续多级主管',
    [NodeSetType.department]: '部门',
    [NodeSetType.designatedCandidate]: '指定候选人',
  }

  /**
   * 流程实例状态枚举
   * {相对应com.aizuda.bpm.engine.core.enums.InstanceState}
   */
  export enum InstanceStateEnum {
    /** 作废状态，删除当前任务，保留了历史审批任务 */
    DESTROY = -3,
    /** 已暂停状态，被主动挂起，暂停执行 */
    SUSPEND = -2,
    /** 暂存待审 */
    SAVE_AS_DRAFT = -1,
    /** 审批中 */
    ACTIVE = 0,
    /** 审批通过 */
    COMPLETE = 1,
    /** 审批拒绝（驳回结束流程） */
    REJECT = 2,
    /** 撤销审批 */
    REVOKE = 3,
    /** 超时结束 */
    TIMEOUT = 4,
    /** 强制终止 */
    TERMINATE = 5,
    /** 自动通过 */
    AUTO_PASS = 6,
    /** 自动拒绝 */
    AUTO_REJECT = 7,
  }

  export const InstanceStateEnumMap: Record<InstanceStateEnum, string> = {
    [InstanceStateEnum.DESTROY]: '作废',
    [InstanceStateEnum.SUSPEND]: '已暂停',
    [InstanceStateEnum.SAVE_AS_DRAFT]: '暂存待审',
    [InstanceStateEnum.ACTIVE]: '审批中',
    [InstanceStateEnum.COMPLETE]: '审批通过',
    [InstanceStateEnum.REJECT]: '审批拒绝',
    [InstanceStateEnum.REVOKE]: '撤销审批',
    [InstanceStateEnum.TIMEOUT]: '超时结束',
    [InstanceStateEnum.TERMINATE]: '强制终止',
    [InstanceStateEnum.AUTO_PASS]: '自动通过',
    [InstanceStateEnum.AUTO_REJECT]: '自动拒绝',
  }

}

export default FlowEnums;
