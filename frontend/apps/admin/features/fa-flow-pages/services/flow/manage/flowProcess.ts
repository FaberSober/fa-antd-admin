import { GATE_APP } from '@/configs';
import { BaseApi, Fa } from '@fa/ui';
import { Flow } from '@/types';

/** ------------------------------------------ FLOW-流程定义 操作接口 ------------------------------------------ */
class Api extends BaseApi<Flow.FlowProcess, number> {

  /** 发布流程 */
  publish = (entity: Flow.FlowProcess): Promise<Fa.Ret<boolean>> => this.post('publish', entity);

  /** 发起流程 */
  start = (params: Flow.FlowProcessStartReqVo): Promise<Fa.Ret<boolean>> => this.post('start', params);

  /** 查看流程详情 */
  getApprovalInfoById = (instanceId: string): Promise<Fa.Ret<Flow.FlowApprovalInfo>> => this.get(`getApprovalInfoById/${instanceId}`);

  // /** 启用流程 */
  // activeById = (id: number): Promise<Fa.Ret<boolean>> => this.get(`activeById/${id}`);

  // /** 停用流程 */
  // deactiveById = (id: number): Promise<Fa.Ret<boolean>> => this.get(`deactiveById/${id}`);

}

export default new Api(GATE_APP.flow.manage, 'flowProcess');
