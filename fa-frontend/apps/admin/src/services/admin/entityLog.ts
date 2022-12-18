import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import * as Admin from '../../../types/admin';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class EntityLogApi extends BaseApi<Admin.EntityLog, number> {}

export default new EntityLogApi(GATE_APP.admin, 'entityLog');
