import { GATE_APP } from '@/configs';
import { BaseApi, type Fa } from '@fa/ui';
import type { Admin } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<Admin.ConfigScene, number> {
  /** 查找所有场景配置 */
  findAllScene = (params: { biz: string }): Promise<Fa.Ret<Admin.ConfigScene[]>> => this.get(`findAllScene`, params);

  /** 查找场景配置 */
  findByScene = (params: { biz: string }): Promise<Fa.Ret<Admin.ConfigScene>> => this.get(`findByScene`, params);

  /** 批量更新场景配置-更新排序 */
  batchUpdate = (params: { id: number; hide: boolean; defaultScene: boolean }[]): Promise<Fa.Ret> => this.post(`batchUpdate`, params);
}

export default new Api(GATE_APP.admin, 'configScene');
