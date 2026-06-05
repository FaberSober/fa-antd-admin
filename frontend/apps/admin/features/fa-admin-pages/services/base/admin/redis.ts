import { GATE_APP } from '@/configs';
import { BaseZeroApi, type Fa } from '@fa/ui';
import type { Admin } from '@/types';

/** ------------------------------------------ Redis 操作接口 ------------------------------------------ */
class Redis extends BaseZeroApi {
  /** 概览 */
  overview = (): Promise<Fa.Ret<Admin.RedisOverview>> => this.get('overview');

  /** key列表 */
  listKeys = (keyword?: string, limit = 300): Promise<Fa.Ret<Admin.RedisKeyList>> =>
    this.get('listKeys', { keyword, limit });

  /** key详情 */
  detail = (key: string): Promise<Fa.Ret<Admin.RedisKeyDetail>> => this.get('detail', { key });

  /** 删除单个key */
  deleteKey = (key: string): Promise<Fa.Ret<boolean>> => this.delete('delete', { key });

  /** 批量删除key */
  batchDelete = (keys: string[]): Promise<Fa.Ret<number>> => this.post('batchDelete', { keys });
}

export default new Redis(GATE_APP.admin, 'redis');
