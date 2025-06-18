import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import type { Rbac } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacRoleApi extends BaseApi<Rbac.RbacRole, string> {}

export default new RbacRoleApi(GATE_APP.rbac, 'rbacRole');
