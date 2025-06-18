import {GATE_APP} from '@ui/configs';
import {BaseTreeApi} from '@ui/services';
import {Admin} from '@ui/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'department';

class Department extends BaseTreeApi<Admin.Department, string, Admin.DepartmentVo> {}

export default new Department(GATE_APP.admin, serviceModule);
