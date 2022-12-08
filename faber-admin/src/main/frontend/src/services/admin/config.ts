import queryString from 'querystring';
import {GATE_APP} from '@/configs/server.config';
import Admin from '@/props/admin';
import {BaseApi} from '@/services/base';
import Fa from "@/props/base/Fa";
import FaEnums from "@/props/base/FaEnums";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class ConfigApi extends BaseApi<Admin.Config, number> {
	/** 查找所有场景配置 */
	findAllScene = (params: { buzzModal: string; type: FaEnums.ConfigTypeEnum }): Promise<Fa.Ret<Admin.Config[]>> => this.get(`findAllScene`, params);

	/** 查找场景配置 */
	findByScene = (params: { buzzModal: string; type: FaEnums.ConfigTypeEnum }): Promise<Fa.Ret<Admin.Config>> => this.get(`findByScene`, params);

	/** 批量更新场景配置-更新排序 */
	batchUpdate = (params: { id: number; hide: boolean; defaultScene: boolean }[]): Promise<Fa.Ret> => this.post(`batchUpdate`, params);
}

export default new ConfigApi(GATE_APP.admin, 'config');
