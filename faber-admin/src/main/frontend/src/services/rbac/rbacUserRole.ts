import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import Rbac from '@/props/rbac';
import Ajax from "../../props/base/Ajax";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacUserRoleApi extends BaseApi<Rbac.RbacUserRole, number> {

  /** 获取登录账户的角色列表 */
  getMyRoles = (): Promise<Ajax.Response<Rbac.RbacRole[]>> => this.get('getMyRoles');

  /** 获取登录账户的权限列表 */
  getMyMenus = (): Promise<Ajax.Response<Rbac.RbacMenu[]>> => this.get('getMyMenus');

}

export default new RbacUserRoleApi(GATE_APP.rbac, 'rbacUserRole');
