import queryString from 'querystring';
import { requestGet, requestPost, requestPut } from '@/utils/request';
import { GATE_APP } from '@/configs/server.config';
import Ajax from '@/props/base/Ajax';
import FaberBase from '@/props/base/FaberBase';
import Admin from '@/props/admin';
import { BaseApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'groupUser';

interface AddProps {
	/** 角色ID */
	groupId: number;
	/** 用户ID */
	userId: number;
	/** 描述 */
	description?: string;
	/** 类型 */
	type: string;
}

class GroupUser extends BaseApi<Admin.GroupUser, number> {
	/** 获取实体List-用户创建 */
	groupUser = (groupId: number, params: FaberBase.BasePageProps): Promise<Ajax.Response<Ajax.Page<Admin.GroupUserVo>>> =>
		requestGet(`${GATE_APP.admin}/${serviceModule}/${groupId}/groupUser?${queryString.stringify(params)}`);

	/** 获取实体List-用户创建 */
	groupUserPost = (params: FaberBase.BasePageProps): Promise<Ajax.Response<Ajax.Page<Admin.GroupUserVo>>> => requestPost(`${GATE_APP.admin}/${serviceModule}/groupUser`, params);

	/** 新增角色用户关联 */
	addUsers = (groupId: number, params: AddProps): Promise<Ajax.Response> => requestPut(`${GATE_APP.admin}/${serviceModule}/${groupId}/addUsers`, params);
}

export default new GroupUser(GATE_APP.admin, serviceModule);
