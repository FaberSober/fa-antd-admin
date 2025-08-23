import { Fa } from '@fa/ui';

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
}

export default Flow;
