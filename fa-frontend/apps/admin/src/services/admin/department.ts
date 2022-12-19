import { GATE_APP } from '@/configs/server.config';
import * as Admin from '../../../types/admin';
import { BaseTreeApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'department';

class Department extends BaseTreeApi<Admin.Department, string, Admin.DepartmentVo> {}

export default new Department(GATE_APP.admin, serviceModule);
