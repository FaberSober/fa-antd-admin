import { GATE_APP } from '@/configs';
import { BaseTreeApi, type Fa } from '@fa/ui';
import type { Admin } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'dict';

class Dict extends BaseTreeApi<Admin.Dict, number> {
  /** 指定code查找字典 */
  getByCode = (code: string): Promise<Fa.Ret<Admin.Dict>> => this.get('getByCode', { code });

  /** 获取实体List */
  listEnum = (enumName: string): Promise<Fa.Ret<Fa.Dict[]>> => this.get('listEnum', { enumName });
}

export default new Dict(GATE_APP.admin, serviceModule);
