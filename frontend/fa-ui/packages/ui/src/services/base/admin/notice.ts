import {GATE_APP} from '@ui/configs';
import {BaseApi} from '@ui/services';
import {Admin} from '@ui/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'notice';

class Notice extends BaseApi<Admin.Notice, number> {}

export default new Notice(GATE_APP.admin, serviceModule);
