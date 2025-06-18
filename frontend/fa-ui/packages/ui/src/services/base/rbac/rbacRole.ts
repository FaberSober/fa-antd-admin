import { GATE_APP } from '@ui/configs';
import { BaseApi } from '@ui/services';
import { Rbac } from '@ui/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacRoleApi extends BaseApi<Rbac.RbacRole, string> {}

export default new RbacRoleApi(GATE_APP.rbac, 'rbacRole');
