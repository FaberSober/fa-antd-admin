import { GATE_APP } from '@/configs/server.config';
import Admin from '@/props/admin';
import { BaseApi } from '@/services/base';
import FaberBase from '@/props/base/FaberBase';
import Ajax from '@/props/base/Ajax';

const serviceModule = 'user';

export interface UserWebQuery extends FaberBase.BasePageProps {
	name: string;
	tel: string;
}

class User extends BaseApi<Admin.User, string, Admin.UserWeb> {

  /** 获取用户信息 */
  getLoginUser = (): Promise<Ajax.Response<Admin.User>> => this.get('getLoginUser');

	/** 获取用户信息 */
	getUserInfo = (): Promise<Ajax.Response<FaberBase.UserInfo>> => this.get(`front/info`);

	/** 分页查询 */
	pageOut = (params: UserWebQuery): Promise<Ajax.Response<Ajax.Page<Admin.UserWeb>>> => this.post(`pageOut`, params);

	/** ------------------------------------------ 个人账户 操作接口 ------------------------------------------ */
	/** 获取个人账户基本信息 */
	accountBase = (): Promise<Ajax.Response<Admin.User>> => this.get(`account/base`);

	/** 更新个人账户基本信息 */
  updateMine = (params: any): Promise<Ajax.Response> => this.post('updateMine', params);

	/** 更新个人账户密码 */
  updateMyPwd = (params: any): Promise<Ajax.Response> => this.post('updateMyPwd', params);

	/** 更新账户ApiToken */
	accountBaseUpdateApiToken = (params: any): Promise<Ajax.Response> => this.post(`account/base/updateApiToken`, params);

	/** 更新个人账户密码 */
	accountAdminUpdatePwd = (params: any): Promise<Ajax.Response> => this.post(`account/admin/updatePwd`, params);

	/** 更新个人账户密码 */
	accountAdminDelete = (params: any): Promise<Ajax.Response> => this.post(`account/admin/delete`, params);
}

export default new User(GATE_APP.admin, serviceModule);
