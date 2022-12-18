import {GATE_APP} from '@/configs/server.config';
import * as Admin from '../../../types/admin';
import {BaseApi} from '@/services/base';
import * as Fa from "@/../../../types/base/Fa";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<Admin.ConfigSys, number> {

  /** 获取系统配置 */
  getOne = (): Promise<Fa.Ret<Admin.ConfigSys>> => this.get('getOne');

  /** 获取系统配置参数 */
  getSystemConfig = (): Promise<Fa.Ret<Admin.SystemConfigPo>> => this.get('getSystemConfig');

}

export default new Api(GATE_APP.admin, 'configSys');
