import {GATE_APP} from '@/configs/server.config';
import Fa from '@/props/base/Fa';
import Admin from '@/props/admin';
import {BaseApi} from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'area';

interface PathResData {
	list: Admin.Area[];
	tree: Fa.TreeNode[];
}

class AreaApi extends BaseApi<Admin.Area, number> {
	/** 获取唯一 xx */
	findOnePath = (areaCode: number): Promise<Fa.Ret<PathResData>> => this.get(`path/${areaCode}`);

	/** 获取唯一 xx */
	findByAreaCode = (areaCode: number): Promise<Fa.Ret<Admin.Area>> => this.get(`findByAreaCode/${areaCode}`);

	/** 获取唯一实体 */
	findAreaByLoc = (lng: number, lat: number): Promise<Fa.Ret<Admin.Area>> => this.get('findAreaByLoc', {lng, lat});
}

export default new AreaApi(GATE_APP.admin, serviceModule);
