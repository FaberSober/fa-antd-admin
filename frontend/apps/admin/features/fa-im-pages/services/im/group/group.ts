import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ 群组 操作接口 ------------------------------------------ */
class GroupApi extends BaseApi<Im.ImGroup, number> {}

export default new GroupApi(GATE_APP.im.group, 'group');
