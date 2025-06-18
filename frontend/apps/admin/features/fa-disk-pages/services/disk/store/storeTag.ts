import { GATE_APP } from '@/configs';
import { BaseTreeApi } from '@fa/ui';
import { Disk } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseTreeApi<Disk.StoreTag, number> {}

export default new Api(GATE_APP.disk.store, 'tag');
