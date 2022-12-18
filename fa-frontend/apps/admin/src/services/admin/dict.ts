import {GATE_APP} from '@/configs/server.config';
import * as Admin from '../../../types/admin';
import {BaseTreeApi} from '@/services/base';
import * as Fa from "@/../../../types/base/Fa";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'dict';

class Dict extends BaseTreeApi<Admin.Dict, number> {

  /** 指定code查找字典 */
  getByCode = (code: string): Promise<Fa.Ret<Admin.Dict>> => this.get('getByCode', {code});

  /** 获取实体List */
  listEnum = (enumName: string): Promise<Fa.Ret<Fa.Dict[]>> => this.get('listEnum', {enumName});

}

export default new Dict(GATE_APP.admin, serviceModule);
