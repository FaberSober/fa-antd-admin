import {GATE_APP} from '@/configs/server.config';
import {BaseApi} from '@/services/base';
import Admin from '@/props/admin';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class JobLogApi extends BaseApi<Admin.JobLog, number> {}

export default new JobLogApi(GATE_APP.admin, 'jobLog');
