import {GATE_APP} from '@ui/configs';
import {BaseApi} from '@ui/services';
import {Admin} from '@ui/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class EntityLogApi extends BaseApi<Admin.EntityLog, number> {}

export default new EntityLogApi(GATE_APP.admin, 'entityLog');
