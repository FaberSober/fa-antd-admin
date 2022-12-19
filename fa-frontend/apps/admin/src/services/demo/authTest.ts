import { GATE_APP } from '@/configs/server.config';
import { BaseZeroApi } from '@/services/base';
import { Fa } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class AuthTestApi extends BaseZeroApi {
  /** 测试-权限1 */
  test1 = (): Promise<Fa.Ret<string>> => this.get('test1');

  /** 测试-权限2 */
  test2 = (): Promise<Fa.Ret<string>> => this.get('test2');
}

export default new AuthTestApi(GATE_APP.demo, 'authTest');
