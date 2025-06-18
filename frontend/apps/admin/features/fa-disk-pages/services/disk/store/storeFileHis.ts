import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Disk } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<Disk.StoreFileHis, string> {}

export default new Api(GATE_APP.disk.store, 'storeFileHis');
