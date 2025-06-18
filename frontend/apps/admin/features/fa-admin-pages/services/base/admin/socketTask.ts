import { GATE_APP } from '@/configs';
import { BaseZeroApi } from '@fa/ui';
import type { Fa } from '@fa/ui';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseZeroApi {
  /** 停止任务 */
  stop = (params: { taskId: string }): Promise<Fa.Ret<Fa.SocketTaskVo>> => this.post('stop', params);
}

export default new Api(GATE_APP.admin, 'socketTask');
