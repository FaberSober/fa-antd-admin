import { GATE_APP } from '@/configs/server.config';
import Admin from '@/props/admin';
import { BaseTreeApi } from '@/services/base';
import Ajax from '@/props/base/Ajax';
import { requestGet } from '@/utils/request';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'group';

class GroupApi extends BaseTreeApi<Admin.Group, number> {
	/** 查询用户所在的角色组 */
	queryUserGroup = (userId: string): Promise<Ajax.Response<Admin.Group[]>> => requestGet(`${this.apiPrefix}/${this.apiModal}/queryUserGroup/${userId}`);
}

export default new GroupApi(GATE_APP.admin, serviceModule);
