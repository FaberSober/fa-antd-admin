import { GATE_APP } from '@ui/configs';
import { BaseApi } from '@ui/services';
import { Fa, Rbac } from '@ui/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacRoleMenuApi extends BaseApi<Rbac.RbacRoleMenu, string> {
  /** 获取角色权限点 */
  getRoleMenu = (roleId: string): Promise<Fa.Ret<Rbac.RoleMenuVo>> => this.get(`getRoleMenu/${roleId}`);

  /** 更新角色权限点 */
  updateRoleMenu = (params: Rbac.RoleMenuVo): Promise<Fa.Ret> => this.post('updateRoleMenu', params);
}

export default new RbacRoleMenuApi(GATE_APP.rbac, 'rbacRoleMenu');
