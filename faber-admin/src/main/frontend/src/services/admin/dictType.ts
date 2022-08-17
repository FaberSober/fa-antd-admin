import { GATE_APP } from '@/configs/server.config';
import Admin from '@/props/admin';
import { BaseTreeApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'dictType';

class DictType extends BaseTreeApi<Admin.DictType, number> {}

export default new DictType(GATE_APP.admin, serviceModule);
