import { GATE_APP } from '@/configs';
import { BaseZeroApi, Fa } from '@fa/ui';
import { Flow } from '@/types';

/** ------------------------------------------ FLOW-流程定义 操作接口 ------------------------------------------ */
class Api extends BaseZeroApi {

  /** 待审批 */
  pagePendingApproval = (params: Fa.BasePageQuery<Flow.FlowTaskPageReqVo>): Promise<Fa.Ret<Fa.Page<Flow.FlowTaskRet>>> => this.post('pagePendingApproval', params);

  /** 同意流程 */
  pass = (params: { taskId: string }): Promise<Fa.Ret<boolean>> => this.post('pass', params);

  /** 拒绝流程 */
  reject = (params: { taskId: string }): Promise<Fa.Ret<boolean>> => this.post('reject', params);

}

export default new Api(GATE_APP.flow.manage, 'flowTask');
