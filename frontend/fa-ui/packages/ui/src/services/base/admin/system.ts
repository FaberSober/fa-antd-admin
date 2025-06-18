import {GATE_APP} from '@ui/configs';
import {BaseZeroApi} from '@ui/services';
import {Admin, Fa} from '@ui/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class SystemApi extends BaseZeroApi {
  /** 获取服务器信息 */
  server = (): Promise<Fa.Ret<Admin.ServerInfo>> => this.get('server');
}

export default new SystemApi(GATE_APP.admin, 'system');
