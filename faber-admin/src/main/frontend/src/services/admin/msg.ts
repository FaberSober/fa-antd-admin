import { requestGet, requestPost } from '@/utils/request';
import { GATE_APP } from '@/configs/server.config';
import Ajax from '@/props/base/Ajax';
import FaberBase from '@/props/base/FaberBase';
import Admin from '@/props/admin';
import { BaseApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'msg';

class Msg extends BaseApi<Admin.Msg, number, Admin.MsgPageVo> {
	/** 获取实体 分页 */
	pageMine = (params: FaberBase.BasePageProps): Promise<Ajax.Response<Ajax.Page<Admin.MsgPageVo>>> => requestPost(`${GATE_APP.admin}/${serviceModule}/page/mine`, params);

	/** 批量已读 */
	batchRead = (params: { ids: number[] }): Promise<Ajax.Response> => requestPost(`${GATE_APP.admin}/${serviceModule}/batchRead`, params);

	/** 消息数量统计 */
	countMine = (): Promise<Ajax.Response<{ unreadCount: number }>> => requestGet(`${GATE_APP.admin}/${serviceModule}/count/mine`);
}

export default new Msg(GATE_APP.admin, serviceModule);
