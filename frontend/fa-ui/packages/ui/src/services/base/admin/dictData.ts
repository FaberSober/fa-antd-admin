import {GATE_APP} from '@ui/configs';
import {BaseTreeApi} from '@ui/services';
import {Admin, Fa} from '@ui/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'dictData';

class Dict extends BaseTreeApi<Admin.DictData, number> {
}

export default new Dict(GATE_APP.admin, serviceModule);
