import { GATE_APP } from '@/configs';
import { BaseZeroApi } from '@fa/ui';
import type { Fa } from '@fa/ui';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class AuthTestApi extends BaseZeroApi {
  /** 开启任务 */
  start = (): Promise<Fa.Ret<Fa.SocketTaskVo>> => this.get('start');

  /** 停止任务 */
  stop = (params: {taskId: string}): Promise<Fa.Ret<Fa.SocketTaskVo>> => this.post('stop', params);
}

export default new AuthTestApi(GATE_APP.demo, 'socketTaskTest');
