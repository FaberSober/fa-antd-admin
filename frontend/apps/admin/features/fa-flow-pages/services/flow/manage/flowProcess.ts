import { GATE_APP } from '@/configs';
import { BaseApi, Fa } from '@fa/ui';
import { Flow } from '@/types';

/** ------------------------------------------ FLOW-流程定义 操作接口 ------------------------------------------ */
class Api extends BaseApi<Flow.FlowProcess, number> {

  /** 部署流程 */
  deployById = (id: number): Promise<Fa.Ret<boolean>> => this.get(`deployById/${id}`);

  // /** 启用流程 */
  // activeById = (id: number): Promise<Fa.Ret<boolean>> => this.get(`activeById/${id}`);

  // /** 停用流程 */
  // deactiveById = (id: number): Promise<Fa.Ret<boolean>> => this.get(`deactiveById/${id}`);

}

export default new Api(GATE_APP.flow.manage, 'flowProcess');
