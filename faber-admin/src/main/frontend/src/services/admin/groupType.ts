import { GATE_APP } from '@/configs/server.config';
import Admin from '@/props/admin';
import { BaseTreeApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'groupType';

class Department extends BaseTreeApi<Admin.GroupType, number> {}

export default new Department(GATE_APP.admin, serviceModule);
