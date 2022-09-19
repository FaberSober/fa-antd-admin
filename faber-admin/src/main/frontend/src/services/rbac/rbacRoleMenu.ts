import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import Rbac from '@/props/rbac';
import Ajax from '../../props/base/Ajax';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacRoleMenuApi extends BaseApi<Rbac.RbacRoleMenu, number> {
	/** 增加实体信息 */
	updateRoleMenu = (params: Rbac.UpdateRoleMenuVo): Promise<Ajax.Response> => this.post('updateRoleMenu', params);
}

export default new RbacRoleMenuApi(GATE_APP.rbac, 'rbacRoleMenu');
