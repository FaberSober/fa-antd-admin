import { GATE_APP } from '@/configs';
import { BaseApi, type Fa } from '@fa/ui';
import type { Admin } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<Admin.Config<any>, number> {
  /** 获取唯一配置 */
  getOne = (biz: string, type: string): Promise<Fa.Ret<Admin.Config<any>>> => this.get('getOne', { biz, type });

  /** 获取全局唯一配置 */
  getOneGlobal = (biz: string, type: string): Promise<Fa.Ret<Admin.Config<any>>> => this.get('getOneGlobal', { biz, type });

  /** 保存全局唯一配置 */
  saveGlobal = (params: any): Promise<Fa.Ret<Admin.Config<any>>> => this.post('saveGlobal', params);
}

export default new Api(GATE_APP.admin, 'config');
