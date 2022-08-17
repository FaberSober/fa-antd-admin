import queryString from 'querystring';
import { requestGet, requestPost } from '@/utils/request';
import { GATE_APP } from '@/configs/server.config';
import Admin from '@/props/admin';
import Ajax from '@/props/base/Ajax';
import { BaseApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'config';

class ConfigApi extends BaseApi<Admin.Config, number> {
	/** 查找所有场景配置 */
	findAllScene = (params: { buzzModal: string; type: Admin.ConfigType }): Promise<Ajax.Response<Admin.Config[]>> =>
		requestGet(`${GATE_APP.admin}/${serviceModule}/findAllScene?${queryString.stringify(params)}`);

	/** 查找场景配置 */
	findByScene = (params: { buzzModal: string; type: Admin.ConfigType }): Promise<Ajax.Response<Admin.Config>> =>
		requestGet(`${GATE_APP.admin}/${serviceModule}/findByScene?${queryString.stringify(params)}`);

	/** 批量更新场景配置-更新排序 */
	batchUpdate = (params: { id: number; hide: string; defaultScene: string }[]): Promise<Ajax.Response> => requestPost(`${GATE_APP.admin}/${serviceModule}/batchUpdate`, params);
}

export default new ConfigApi(GATE_APP.admin, 'config');
