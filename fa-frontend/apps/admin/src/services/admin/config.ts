import {GATE_APP} from '@/configs/server.config';
import * as Admin from '../../../types/admin';
import {BaseApi} from '@/services/base';
import * as Fa from "@/../../../types/base/Fa";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<Admin.Config<any>, number> {

  /** 获取唯一配置 */
  getOne = (biz: string, type: string): Promise<Fa.Ret<Admin.Config<any>>> => this.get('getOne', {biz, type});

}

export default new Api(GATE_APP.admin, 'config');
