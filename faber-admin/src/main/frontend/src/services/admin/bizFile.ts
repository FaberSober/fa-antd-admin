import {GATE_APP} from '@/configs/server.config';
import Admin from '@/props/admin';
import {BaseApi} from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'bizFile';

class BizFileApi extends BaseApi<Admin.BizFile, number> {}

export default new BizFileApi(GATE_APP.admin, serviceModule);
