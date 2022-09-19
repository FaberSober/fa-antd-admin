import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import Rbac from '@/props/rbac';
import Ajax from '../../props/base/Ajax';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacRoleMenuApi extends BaseApi<Rbac.RbacRoleMenu, number> {
	/** 获取角色权限点 */
	getRoleMenu = (roleId: number): Promise<Ajax.Response<Rbac.RoleMenuVo>> => this.get(`getRoleMenu/${roleId}`);

	/** 更新角色权限点 */
	updateRoleMenu = (params: Rbac.RoleMenuVo): Promise<Ajax.Response> => this.post('updateRoleMenu', params);
}

export default new RbacRoleMenuApi(GATE_APP.rbac, 'rbacRoleMenu');
