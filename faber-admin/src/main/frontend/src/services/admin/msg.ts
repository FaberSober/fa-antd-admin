import { GATE_APP } from '@/configs/server.config';
import Ajax from '@/props/base/Ajax';
import FaberBase from '@/props/base/FaberBase';
import Admin from '@/props/admin';
import { BaseApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'msg';

class Msg extends BaseApi<Admin.Msg, string> {
	/** 获取实体 分页 */
	pageMine = (params: FaberBase.BasePageProps): Promise<FaberBase.Response<FaberBase.Page<Admin.Msg>>> => this.post(`pageMine`, params);

	/** 批量已读 */
	batchRead = (ids: string[]): Promise<FaberBase.Response> => this.post(`batchRead`, ids);

	/** 消息数量统计 */
	countMine = (): Promise<FaberBase.Response<{ unreadCount: number }>> => this.get(`countMine`);
}

export default new Msg(GATE_APP.admin, serviceModule);
