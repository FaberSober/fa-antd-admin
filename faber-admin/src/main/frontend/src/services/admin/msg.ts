import { GATE_APP } from '@/configs/server.config';
import Ajax from '@/props/base/Ajax';
import FaberBase from '@/props/base/FaberBase';
import Admin from '@/props/admin';
import { BaseApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'msg';

class Msg extends BaseApi<Admin.Msg, string> {
	/** 获取实体 分页 */
	pageMine = (params: FaberBase.BasePageProps): Promise<Ajax.Response<Ajax.Page<Admin.Msg>>> => this.post(`pageMine`, params);

	/** 批量已读 */
	batchRead = (ids: string[]): Promise<Ajax.Response> => this.post(`batchRead`, ids);

	/** 消息数量统计 */
	countMine = (): Promise<Ajax.Response<{ unreadCount: number }>> => this.get(`countMine`);
}

export default new Msg(GATE_APP.admin, serviceModule);
