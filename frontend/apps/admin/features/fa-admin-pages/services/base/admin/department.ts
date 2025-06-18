import { GATE_APP } from '@/configs';
import { BaseTreeApi } from '@fa/ui';
import type { Admin } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'department';

class Department extends BaseTreeApi<Admin.Department, string, Admin.DepartmentVo> {}

export default new Department(GATE_APP.admin, serviceModule);
