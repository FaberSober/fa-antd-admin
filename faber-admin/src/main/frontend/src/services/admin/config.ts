import {GATE_APP} from '@/configs/server.config';
import Admin from '@/props/admin';
import {BaseApi} from '@/services/base';
import Fa from "@/props/base/Fa";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<Admin.ConfigCol<any>, number> {

  /** 获取唯一配置 */
  getOne = (biz: string, type: string): Promise<Fa.Ret<Admin.ConfigCol<any>>> => this.get('getOne', {biz, type});

}

export default new Api(GATE_APP.admin, 'config');
