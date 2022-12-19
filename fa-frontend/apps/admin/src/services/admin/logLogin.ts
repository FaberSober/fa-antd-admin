import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import { Admin } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class LogLoginApi extends BaseApi<Admin.LogLogin, number> {}

export default new LogLoginApi(GATE_APP.admin, 'logLogin');
