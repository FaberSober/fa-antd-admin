import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import Rbac from '@/props/rbac';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacMenuApi extends BaseApi<Rbac.RbacMenu, number> {}

export default new RbacMenuApi(GATE_APP.rbac, 'rbacMenu');
