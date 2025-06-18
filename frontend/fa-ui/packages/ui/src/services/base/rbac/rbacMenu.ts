import { GATE_APP } from '@ui/configs';
import { BaseTreeApi } from '@ui/services';
import { Rbac } from '@ui/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacMenuApi extends BaseTreeApi<Rbac.RbacMenu, string> {}

export default new RbacMenuApi(GATE_APP.rbac, 'rbacMenu');
