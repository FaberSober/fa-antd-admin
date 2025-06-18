import { GATE_APP } from '@/configs';
import { BaseZeroApi } from '@fa/ui';
import type { Fa } from '@fa/ui';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class AuthTestApi extends BaseZeroApi {
  /** 测试-权限1 */
  test1 = (): Promise<Fa.Ret<string>> => this.get('test1');

  /** 测试-权限2 */
  test2 = (): Promise<Fa.Ret<string>> => this.get('test2');
}

export default new AuthTestApi(GATE_APP.demo, 'authTest');
