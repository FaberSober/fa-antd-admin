import { Fa } from '@fa/ui';
import Flw from './Flw';

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
    /** Model Content - 模型内容 */
    modelContent: string;
    /** Render Nodes - 渲染节点 */
    renderNodes?: Record<string, any>;
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

}

export default Flow;
