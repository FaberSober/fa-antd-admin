import {GATE_APP} from '@ui/configs';
import {BaseApi} from '@ui/services';
import {Admin} from '@ui/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class LogLoginApi extends BaseApi<Admin.LogLogin, number> {}

export default new LogLoginApi(GATE_APP.admin, 'logLogin');
