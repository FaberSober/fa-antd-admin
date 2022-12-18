import {GATE_APP} from '@/configs/server.config';
import Admin from '@/props/admin';
import {BaseApi} from '@/services/base';
import Fa from '@/props/base/Fa';

const serviceModule = 'user';

export interface UserWebQuery extends Fa.BasePageProps {
	name: string;
	tel: string;
}

class User extends BaseApi<Admin.User, string, Admin.UserWeb> {

  /** 获取用户信息 */
  getLoginUser = (): Promise<Fa.Ret<Admin.User>> => this.get('getLoginUser');

	/** 分页查询 */
	pageOut = (params: UserWebQuery): Promise<Fa.Ret<Fa.Page<Admin.UserWeb>>> => this.post(`pageOut`, params);

	/** ------------------------------------------ 个人账户 操作接口 ------------------------------------------ */

	/** 更新个人账户基本信息 */
  updateMine = (params: any): Promise<Fa.Ret> => this.post('updateMine', params);

	/** 更新个人账户密码 */
  updateMyPwd = (params: any): Promise<Fa.Ret> => this.post('updateMyPwd', params);

}

export default new User(GATE_APP.admin, serviceModule);
