import {GATE_APP} from '@/configs/server.config';
import {BaseZeroApi} from '@/services/base';
import Fa from "@/props/base/Fa";
import Admin from "@/props/admin";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class SystemApi extends BaseZeroApi {

  /** 获取服务器信息 */
  server = (): Promise<Fa.Ret<Admin.ServerInfo>> => this.get('server');

}

export default new SystemApi(GATE_APP.admin, 'system');
