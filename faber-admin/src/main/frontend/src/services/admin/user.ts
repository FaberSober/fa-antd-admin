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
  getLoginUser = (): Promise<FaberBase.Response<Admin.User>> => this.get('getLoginUser');

	/** 分页查询 */
	pageOut = (params: UserWebQuery): Promise<FaberBase.Response<FaberBase.Page<Admin.UserWeb>>> => this.post(`pageOut`, params);

	/** ------------------------------------------ 个人账户 操作接口 ------------------------------------------ */

	/** 更新个人账户基本信息 */
  updateMine = (params: any): Promise<FaberBase.Response> => this.post('updateMine', params);

	/** 更新个人账户密码 */
  updateMyPwd = (params: any): Promise<FaberBase.Response> => this.post('updateMyPwd', params);

}

export default new User(GATE_APP.admin, serviceModule);
