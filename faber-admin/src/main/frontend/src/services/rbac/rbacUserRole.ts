import {GATE_APP} from '@/configs/server.config';
import {BaseApi} from '@/services/base';
import Rbac from '@/props/rbac';
import Ajax from '@/props/base/Ajax';
import FaberBase from "../../props/base/FaberBase";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacUserRoleApi extends BaseApi<Rbac.RbacUserRole, string> {
	/** 获取登录账户的角色列表 */
	getMyRoles = (): Promise<Ajax.Response<Rbac.RbacRole[]>> => this.get('getMyRoles');

	/** 获取登录账户的权限列表 */
	getMyMenus = (): Promise<Ajax.Response<Rbac.RbacMenu[]>> => this.get('getMyMenus');

	/** 获取登录账户的权限Tree */
  getMyMenusTree = (): Promise<Ajax.Response<FaberBase.TreeNode<Rbac.RbacMenu>[]>> => this.get('getMyMenusTree');

	/** 获取实体 分页 */
	pageVo = (params: Rbac.RbacUserRoleQueryVo): Promise<Ajax.Response<Ajax.Page<Rbac.RbacUserRoleRetVo>>> => this.post('pageVo', params);
}

export default new RbacUserRoleApi(GATE_APP.rbac, 'rbacUserRole');
