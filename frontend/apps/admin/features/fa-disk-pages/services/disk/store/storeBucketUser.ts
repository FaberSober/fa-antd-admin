import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Disk } from '@/types';
import { Fa } from '@fa/ui';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<Disk.StoreBucketUser, number> {
  /** 更新库人员 */
  updateBucketUser = (params: any[]): Promise<Fa.Ret<boolean>> => this.post('updateBucketUser', params);
}

export default new Api(GATE_APP.disk.store, 'bucketUser');
