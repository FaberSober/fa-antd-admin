import {GATE_APP} from '@/configs/server.config';
import {BaseApi} from '@/services/base';
import * as Admin from '@/props/admin';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class LogApiApi extends BaseApi<Admin.LogApi, string> {}

export default new LogApiApi(GATE_APP.admin, 'logApi');
