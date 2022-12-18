import {GATE_APP} from '@/configs/server.config';
import {BaseTreeApi} from '@/services/base';
import * as Rbac from '../../../types/rbac';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacMenuApi extends BaseTreeApi<Rbac.RbacMenu, string> {}

export default new RbacMenuApi(GATE_APP.rbac, 'rbacMenu');
