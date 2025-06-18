import { BaseZeroApi, type Fa } from '@fa/ui';
import { GATE_APP } from '@/configs';

class Api extends BaseZeroApi {
  /** 登录 */
  login = (username: string, password: string): Promise<Fa.Ret<Fa.LoginToken>> => this.post('login', { username, password });

  /** 登出 */
  logout = (): Promise<Fa.Ret<string>> => this.get('logout');
}

export default new Api(GATE_APP.admin, 'auth');
