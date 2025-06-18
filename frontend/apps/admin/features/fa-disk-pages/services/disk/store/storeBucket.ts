import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Fa } from '@fa/ui';
import { Disk } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<Disk.StoreBucket, number> {
  /** 个人库列表 */
  getMyList = (): Promise<Fa.Ret<Disk.StoreBucket[]>> => this.get('getMyList');
}

export default new Api(GATE_APP.disk.store, 'bucket');
