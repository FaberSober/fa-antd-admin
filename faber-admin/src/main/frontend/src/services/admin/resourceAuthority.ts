import { GATE_APP } from '@/configs/server.config';
import Ajax from '@/props/base/Ajax';
import Admin from '@/props/admin';
import { BaseApi } from '@/services/base';

export interface UpdateGroupAuthParams {
	groupId: number;
	menuAddIds: number[];
	menuRemoveIds: number[];
	elementAddIds: number[];
	elementRemoveIds: number[];
}

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'resourceAuthority';

class ResourceAuthority extends BaseApi<Admin.ResourceAuthority, number> {
	/** 更新角色权限 */
	updateGroupAuth = (params: UpdateGroupAuthParams): Promise<Ajax.Response> => super.post(`updateGroupAuth`, params);
}

export default new ResourceAuthority(GATE_APP.admin, serviceModule);
