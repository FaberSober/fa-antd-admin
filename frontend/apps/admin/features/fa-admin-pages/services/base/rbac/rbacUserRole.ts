import { GATE_APP } from '@/configs';
import { BaseApi, type Fa } from '@fa/ui';
import type { Rbac } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacUserRoleApi extends BaseApi<Rbac.RbacUserRole, string> {
  /** 获取账户的角色列表 */
  getUserRoles = (userId: string): Promise<Fa.Ret<Rbac.RbacRole[]>> => this.get(`getUserRoles/${userId}`);

  /** 获取登录账户的角色列表 */
  getMyRoles = (): Promise<Fa.Ret<Rbac.RbacRole[]>> => this.get('getMyRoles');

  /** 获取登录账户的权限列表 */
  getMyMenus = (): Promise<Fa.Ret<Rbac.RbacMenu[]>> => this.get('getMyMenus');

  /** 获取登录账户的权限Tree */
  getMyMenusTree = (): Promise<Fa.Ret<Fa.TreeNode<Rbac.RbacMenu>[]>> => this.get('getMyMenusTree');

  /** 获取实体 分页 */
  pageVo = (params: Fa.BasePageQuery<Rbac.RbacUserRoleQueryVo>): Promise<Fa.Ret<Fa.Page<Rbac.RbacUserRoleRetVo>>> => this.post('pageVo', params);

  /** 添加用户角色 */
  addUsers = (userIds: string[], roleId: string): Promise<Fa.Ret<boolean>> => this.post('addUsers', { userIds, roleId });

  /** 添加用户角色 */
  updateUserRoles = (params: { userId: string; roleIds: string[] }): Promise<Fa.Ret<boolean>> => this.post('updateUserRoles', params);
}

export default new RbacUserRoleApi(GATE_APP.rbac, 'rbacUserRole');
