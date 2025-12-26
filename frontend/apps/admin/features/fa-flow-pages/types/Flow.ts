import { Fa } from '@fa/ui';
import FlwEnums from './FlwEnums';
import FlowEnums from './FlowEnums';
import { Layout } from 'react-grid-layout';
import React from 'react';

namespace Flow {
  /** FLOW-流程分类 */
  export interface FlowCatagory extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 上级节点 */
    parentId: number;
    /** 名称 */
    name: string;
    /** 排序ID */
    sort: number;
    /** 图标 */
    icon: string;
  }

  /** FLOW-流程定义 */
  export interface FlowProcess extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 流程分类ID */
    catagoryId: number;
    /** 流程定义 key 唯一标识 */
    processKey: string;
    /** 名称 */
    processName: string;
    /** 图标 */
    processIcon: string;
    /** 类型 */
    processType: string;
    /** 流程版本，默认 1 */
    processVersion: number;
    /** 实例地址 */
    instanceUrl: string;
    /** 备注说明 */
    remark: string;
    /** 使用范围 0，全员 1，指定人员（业务关联） 2，均不可提交 */
    useScope: number;
    /** 流程状态 0，不可用 1，可用 2，历史版本 */
    processState: number;
    /** 流程模型定义JSON内容 */
    modelContent: string;
    /** 表单类型 */
    formType: FlowEnums.FlowProcessFormType;
    /** 自定义表单ID */
    formId: number;
    /** 排序ID */
    sort: number;
  }

  export interface FlowProcessStartReqVo {
    processKey: string;
    args: any;
  }

  export interface FlowApprovalInfo {
    /** Instance ID - 实例ID */
    instanceId: number;
    /** Instance State - 实例状态 */
    instanceState: number;
    /** Create By - 创建人 */
    createBy: string;
    /** Create ID - 创建人ID */
    createId: string;
    /** Create Time - 创建时间 */
    createTime: string; // ISO date string format
    /** Form Content - 表单内容 */
    formContent?: string;
    modelContent: string;
    /** Model Content - 模型内容 */
    flwProcess: Flow.FlwProcess;
    /** Render Nodes - 渲染节点 */
    renderNodes?: Record<string, '0' | '1'>;
    /** Process Approvals - 流程审批历史记录列表 */
    processApprovals?: FlowProcessApproval[];
  }

  /** 流程审批历史记录 - Flow Process Approval History */
  export interface FlowProcessApproval {
    /** 任务ID - Task ID */
    id?: string;
    /** 创建人ID - Create ID */
    createId?: string;
    /** 创建人名称 - Create By */
    createBy?: string;
    /** 创建时间 - Create Time */
    createTime?: string; // ISO date string format
    /** 流程实例ID - Instance ID */
    instanceId?: string;
    /** 任务ID - Task ID */
    taskId?: string;
    /** 任务名称 - Task Name */
    taskName?: string;
    /** 任务Key - Task Key */
    taskKey?: string;
    /** 任务类型/状态 - Task Type/Status (1:已完成, -1:待处理) */
    type?: number;
    /** 扩展内容 - Extended Content */
    content?: FlowProcessApprovalContent;
  }

  /** 流程审批历史记录扩展内容 - Flow Process Approval Extended Content */
  export interface FlowProcessApprovalContent {
    /** 节点用户列表 - Node User List */
    nodeUserList?: NodeUser[];
  }

  /** 节点用户 - Node User */
  export interface NodeUser {
    /** 用户ID - User ID */
    id?: string;
    /** 用户名称 - User Name */
    name?: string;
  }

  /** 流程定义表 */
  export interface FlwProcess {
    /** 主键ID */
    id: string;
    /** 租户ID */
    tenantId: string;
    /** 创建人ID */
    createId: string;
    /** 创建人名称 */
    createBy: string;
    /** 创建时间 */
    createTime: string;
    /** 流程定义 key 唯一标识 */
    processKey: string;
    /** 流程定义名称 */
    processName: string;
    /** 流程图标地址 */
    processIcon: string;
    /** 流程类型 */
    processType: string;
    /** 流程版本，默认 1 */
    processVersion: number;
    /** 实例地址 */
    instanceUrl: string;
    /** 备注说明 */
    remark: string;
    /** 使用范围 0，全员 1，指定人员（业务关联） 2，均不可提交 */
    useScope: boolean;
    /** 流程状态 0，不可用 1，可用 2，历史版本 */
    processState: boolean;
    /** 流程模型定义JSON内容 */
    modelContent: string;
    /** 排序 */
    sort: boolean;
  }

  /** 流程实例表 */
  export interface FlwInstance {
    /** 主键ID */
    id: string;
    /** 租户ID */
    tenantId: string;
    /** 创建人ID */
    createId: string;
    /** 创建人名称 */
    createBy: string;
    /** 创建时间 */
    createTime: string;
    /** 流程定义ID */
    processId: string;
    /** 父流程实例ID */
    parentInstanceId: string;
    /** 优先级 */
    priority: boolean;
    /** 流程实例编号 */
    instanceNo: string;
    /** 业务KEY */
    businessKey: string;
    /** 变量json */
    variable: string;
    /** 当前所在节点名称 */
    currentNodeName: string;
    /** 当前所在节点key */
    currentNodeKey: string;
    /** 期望完成时间 */
    expireTime: string;
    /** 上次更新人 */
    lastUpdateBy: string;
    /** 上次更新时间 */
    lastUpdateTime: string;
  }


  /** 历史流程实例表 */
  export interface FlwHisInstance extends FlwInstance {
    /** 实例状态: -3作废, -2已暂停, -1暂存待审, 0审批中, 1审批通过, 2审批拒绝, 3撤销审批, 4超时结束, 5强制终止, 6自动通过, 7自动拒绝 */
    instanceState: number;
    /** 结束时间 */
    endTime: string;
    /** 处理耗时 */
    duration: string;
  }

  /** 工作流任务分页查询请求对象 - Flow Task Page Query Request Object */
  export interface FlowTaskPageReqVo {
    /** 开始时间 - Begin Time */
    beginTime?: string; // ISO date string format
    /** 结束时间 - End Time */
    endTime?: string; // ISO date string format
    /** 实例ID - Instance ID */
    instanceId?: string;
    /** 实例状态 - Instance State */
    instanceState?: string;
    /** 流程名称 - Process Name */
    processName?: string;
  }

  /** 工作流任务返回对象 - Flow Task Return Object */
  export interface FlowTaskRet {
    /** 任务ID - Task ID */
    taskId: string;
    /** 任务Key - Task Key */
    taskKey: string;
    /** 任务名称 - Task Name */
    taskName: string;
    /** 任务类型 - Task Type */
    taskType: number;
    /** 提醒次数 - Remind Repeat */
    remindRepeat?: number;
    /** 任务创建时间 - Task Create Time */
    createTime: string; // ISO date string format
    /** 实例ID - Instance ID */
    instanceId: string;
    /** 实例状态 - Instance State */
    instanceState: number;
    /** 发起人 - Launch By */
    launchBy: string;
    /** 发起时间 - Launch Time */
    launchTime: string; // ISO date string format
    /** 流程ID - Process ID */
    processId: string;
    /** 流程Key - Process Key */
    processKey: string;
    /** 流程名称 - Process Name */
    processName: string;
    /** 流程类型 - Process Type */
    processType?: string;
  }

  /** 历史流程实例返回对象 - Historical Flow Instance Return Object */
  export interface FlowHisInstanceRet {
    /** 流程ID - Process ID */
    processId: string;
    /** 流程名称 - Process Name */
    processName: string;
    /** 流程类型 - Process Type */
    processType: string;
    /** 当前节点名称 - Current Node Name */
    currentNodeName: string;
    /** 当前节点Key - Current Node Key */
    currentNodeKey: string;
    /** 实例ID - Instance ID */
    instanceId: string;
    /** 实例状态 - Instance State */
    instanceState: number;
    /** 创建人ID - Create ID */
    createId: string;
    /** 创建人名称 - Create By */
    createBy: string;
    /** 创建时间 - Create Time */
    createTime: string; // ISO date string format
    /** 结束时间 - End Time */
    endTime: string; // ISO date string format
    /** 处理耗时（毫秒） - Duration (milliseconds) */
    duration: string;
  }

  /** 流程任务数量统计返回对象 - Flow Task Count Return Object */
  export interface FlowTaskCountRet {
    /** 任务数量-待审批 */
    pendingApprovalCount: number;
    /** 任务数量-我的申请 */
    myApplicationCount: number;
    /** 任务数量-我收到的 */
    myReceivedCount: number;
    /** 任务数量-认领任务 */
    claimTaskCount: number;
    /** 任务数量-已审批 */
    auditedCount: number;
  }

  /** 流程任务审批通过请求对象 - Flow Task Pass Request Object */
  export interface FlowTaskPassReqVo {
    /** 任务ID - Task ID */
    taskId: string;
    /** 审批意见 - Comment */
    comment?: string;
  }

  /** 流程任务审批拒绝请求对象 - Flow Task Reject Request Object */
  export interface FlowTaskRejectReqVo {
    /** 任务ID - Task ID */
    taskId: string;
    /** 拒绝原因 - Reason */
    reason?: string;
  }

  /** DEMO-请假流程 */
  export interface DemoFlowLeave extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 流程ID */
    flowId: string;
    /** 请假员工ID */
    applyUserId: string;
    /** 申请日期 */
    applyDate: string;
    /** 请假原因 */
    applyReason: string;
    /** 请假天数 */
    leaveDayCount: number;
    /** 开始时间 */
    leaveStartTime: string;
    /** 结束时间 */
    leaveEndTime: string;
    /** 租户ID */
    tenantId?: number;
  }

  // ------------------------------------------------- Flow -------------------------------------------------
  /** 流程任务消息对象 - Flow Task Message Object */
  export interface FaFlowTaskMsgVo {
    /** 消息标题 - Message Title */
    title?: string;
    /** 消息内容 - Message description */
    description?: string;
    /** 审核人类型 - Event Type */
    eventType?: FlwEnums.NodeType;
    /** 节点名称 - Node Name */
    nodeName?: string;
    /** 节点 key - Node Key */
    nodeKey?: string;
    /** 节点类型 - Task Type */
    taskType?: number;
    /** 流程名称 - Process Name */
    processName?: string;
    /** 流程实例ID - Process Instance ID */
    processInstanceId?: string;
  }


  // ------------------------------------------------- Form -------------------------------------------------
  /** FLOW-流程表单 */
  export interface FlowForm extends Fa.BaseDelEntity {
    /** ID */
    id: number;
    /** 流程分类ID */
    catagoryId: number;
    /** 名称 */
    name: string;
    /** 编码 */
    no: string;
    /** 表单类型:1设计表单/2系统表单 */
    type: number;
    /** 状态：1启用/2禁止 */
    status: number;
    /** 排序ID */
    sort: number;
    /** 图标 */
    icon: string;
    /** 表名 */
    tableName: string;
    /** 备注 */
    remark: string;
    /** 数据库配置 */
    dataConfig: FlowFormDataConfig;
    /** 表单配置 */
    config: FlowFormConfig;
    /** 列表配置 */
    tableConfig: FlowFormTableConfig;
  }

  export interface TableConfigQueryColumn {
    field: string;
    label: string;
    queryType: 'eq'|'like'|'in';
    default?: string;
    multiple: boolean;
    sort: number;
  }

  export interface TableConfigTableColumn {
    filed: string;
    label: string;
    sorter: boolean; // 是否排序
    fix: 'left'|'right'|'none',
    width?: number;
    sort: number;
  }

  export interface FlowFormTableConfig {
    query: {
      columns: TableConfigQueryColumn[];
    },
    table: {
      columns: TableConfigTableColumn[];
      detail: FlowFormTableConfigDetail,
    },
  }

  export interface FlowFormTableConfigDetail {
    type: 'normal' | 'leftTree' | 'editTable' | 'groupTable' | 'treeTable';
  }

  export interface FlowFormDataConfigColumn extends TableColumnVo {
    sort: number;
  }

  export interface FlowFormDataConfigTable {
    tableName: string;
    pkField: string;
    comment: string;
    columns: FlowFormDataConfigColumn[],
  }

  export interface FlowFormDataConfigSubTable extends FlowFormDataConfigTable {
    fkField: string;
  }

  export interface FlowFormDataConfig {
    /** 主表 */
    main: FlowFormDataConfigTable;
    /** 从表 */
    subTables: FlowFormDataConfigSubTable[];
  }


  export interface FlowFormItem {
    type: FlowFormItemType,
    id: string;
    tableName?: string;
    name?: string;
    label?: string;
    rules?: Array<Record<string, any>>;
    children?: FlowFormItem[];
  }

  export interface FlowFormProperty {
    name: string;
    description: string;
    labelWidth: number;
    layout: 'horizontal' | 'vertical' | 'inline';
  }

  export interface FlowFormConfig {
    /** 表单配置 */
    formConfig: FlowFormProperty;
    /** 表单项布局 */
    layout: Layout;
    /** 表单项映射 */
    formItemMap: Record<string, Flow.FlowFormItem>;
  }

  // ------------------------------------------------- FormEditor -------------------------------------------------
  export type FlowFormItemType = 'input' | 'inputnumber' | 'textarea' | 'switch' | 'radio' | 'checkbox' | 'select' | 'cascader' | 'datepicker' | 'timepicker' | 'fileupload' | 'imageupload' | 'colorpicker' | 'rating' | 'slider' | 'richtext' | 'link' | 'row';

  export interface FaFormItem {
    type: FlowFormItemType;
    name: string;
    icon: string|React.ReactNode;
    group: 'formitem'|'layout'|'custom';
  }

  // ------------------------------------------------- Database -------------------------------------------------
  export interface TableInfoVo {
    tableName: string;
    tableComment: string;
    exist: boolean;
    columns: TableColumnVo[];
  }

  export interface TableColumnVo {
    /** 字段名 */
    field: string;
    /** 数据类型（如 varchar(255)） */
    type: string;
    /** 纯类型（如 varchar） */
    dataType: string;
    /** 字符长度（varchar 专用） */
    length: number;
    /** 数字精度 */
    precision: number;
    /** 小数位数 */
    scale: number;
    /** 是否可空（YES/NO） */
    nullable: string;
    /** 默认值 */
    defaultValue: string;
    /** 键类型（PRI 表示主键） */
    key: string;
    /** 自增等（auto_increment） */
    extra: string;
    /** 字段注释（最重要，用于表单 label） */
    comment: string;
  }

}

export default Flow;
