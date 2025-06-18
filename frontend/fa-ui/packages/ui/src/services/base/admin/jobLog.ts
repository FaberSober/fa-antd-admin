import {GATE_APP} from '@ui/configs';
import {BaseApi} from '@ui/services';
import {Admin} from '@ui/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class JobLogApi extends BaseApi<Admin.JobLog, number> {}

export default new JobLogApi(GATE_APP.admin, 'jobLog');
