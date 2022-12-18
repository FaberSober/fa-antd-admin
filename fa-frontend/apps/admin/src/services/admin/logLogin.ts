import {GATE_APP} from '@/configs/server.config';
import {BaseApi} from '@/services/base';
import * as Admin from '@/props/admin';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class LogLoginApi extends BaseApi<Admin.LogLogin, number> {}

export default new LogLoginApi(GATE_APP.admin, 'logLogin');
