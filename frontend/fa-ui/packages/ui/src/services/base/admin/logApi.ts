import {GATE_APP} from '@ui/configs';
import {BaseApi} from '@ui/services';
import {Admin} from '@ui/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class LogApiApi extends BaseApi<Admin.LogApi, string> {}

export default new LogApiApi(GATE_APP.admin, 'logApi');
