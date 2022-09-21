import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import Admin from '@/props/admin';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class GateLogApi extends BaseApi<Admin.GateLog, number> {}

export default new GateLogApi(GATE_APP.admin, 'gateLog');
