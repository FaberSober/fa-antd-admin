import { GATE_APP } from '@/configs';
import { BaseApi, type Fa } from '@fa/ui';
import type { Admin } from '@/types';

const serviceModule = 'user';

export interface UserWebQuery extends Fa.BasePageProps {
  name: string;
  tel: string;
}

export interface UserRegistryVo {
  username: string;
  name: string;
  tel: string;
  password: string;
  passwordConfirm: string;
}

export interface UserForgetResetPwdVo {
  username: string;
  tel: string;
  password: string;
  passwordConfirm: string;
}

class User extends BaseApi<Admin.User, string, Admin.UserWeb> {
  /** 获取用户信息 */
  getLoginUser = (): Promise<Fa.Ret<Admin.User>> => this.get('getLoginUser');

  /** 分页查询 */
  pageOut = (params: UserWebQuery): Promise<Fa.Ret<Fa.Page<Admin.UserWeb>>> => this.post(`pageOut`, params);

  /** 批量更新部门 */
  updateBatchDept = (params: { userIds: string[]; departmentId: string }): Promise<Fa.Ret> => this.post('updateInfoBatch', params);

  /** 批量更新角色 */
  updateBatchRole = (params: { userIds: string[]; roleIds: string[] }): Promise<Fa.Ret> => this.post('updateBatchRole', params);

  /** 批量更新密码 */
  updateBatchPwd = (params: { userIds: string[]; newPwd: string; passwordCheck: string }): Promise<Fa.Ret> => this.post('updateBatchPwd', params);

  /** ------------------------------------------ 个人账户 操作接口 ------------------------------------------ */

  /** 更新个人账户基本信息 */
  updateMine = (params: any): Promise<Fa.Ret> => this.post('updateMine', params);

  /** 更新个人账户密码 */
  updateMyPwd = (params: any): Promise<Fa.Ret> => this.post('updateMyPwd', params);

  /** ------------------------------------------ biz 操作接口 ------------------------------------------ */

  /** 不鉴权计数 */
  jumpCount = (params: { username?: string; tel?: string }): Promise<Fa.Ret<number>> => this.post('jumpCount', params);

  /** 注册 */
  registry = (params: UserRegistryVo): Promise<Fa.Ret<boolean>> => this.post('registry', params);

  /** 重置密码 */
  forgetResetPwd = (params: UserForgetResetPwdVo): Promise<Fa.Ret<boolean>> => this.post('forgetResetPwd', params);

  /** 更新 */
  updateSimpleById = (id: string, params: any): Promise<Fa.Ret> => this.post('updateSimpleById', { id, ...params });
}

export default new User(GATE_APP.admin, serviceModule);
