import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import Rbac from '@/props/rbac';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacRoleApi extends BaseApi<Rbac.RbacRole, number> {}

export default new RbacRoleApi(GATE_APP.rbac, 'rbacRole');
