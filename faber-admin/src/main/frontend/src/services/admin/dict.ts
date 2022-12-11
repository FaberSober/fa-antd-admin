import {GATE_APP} from '@/configs/server.config';
import Admin from '@/props/admin';
import {BaseTreeApi} from '@/services/base';
import Fa from "@/props/base/Fa";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'dict';

class Dict extends BaseTreeApi<Admin.Dict, number> {

  /** 指定code查找字典 */
  getByCode = (code: string): Promise<Fa.Ret<Admin.Dict>> => this.get('getByCode', {code});

  /** 获取实体List */
  listEnum = (enumName: string): Promise<Fa.Ret<Fa.Dict[]>> => this.get('listEnum', {enumName});

  /** 获取系统配置参数 */
  getSystemConfig = (): Promise<Fa.Ret<Admin.SystemConfigPo>> => this.get('getSystemConfig');

}

export default new Dict(GATE_APP.admin, serviceModule);
