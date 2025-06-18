import { Fa } from '@ui/types';
import { BaseZeroApi } from "@ui/services";
import { GATE_APP } from "@ui/configs";

class Api extends BaseZeroApi {
  /** 登录 */
  login = (username: string, password: string): Promise<Fa.Ret<string>> => this.post('login', { username, password });

}

export default new Api(GATE_APP.admin, 'auth');
