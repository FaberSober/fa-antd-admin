import { requestGet } from '@/utils/request';
import { GATE_APP } from '@/configs/server.config';
import Ajax from '@/props/base/Ajax';
import Admin from '@/props/admin';
import { BaseApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'job';

class Job extends BaseApi<Admin.Job, number> {
	/** 获取唯一实体 */
	runOneTime = (id: number): Promise<Ajax.Response> => requestGet(`${GATE_APP.admin}/${serviceModule}/${id}/runOneTime`);

	/** 获取唯一实体 */
	startJob = (id: number): Promise<Ajax.Response> => requestGet(`${GATE_APP.admin}/${serviceModule}/${id}/startJob`);

	/** 获取唯一实体 */
	endJob = (id: number): Promise<Ajax.Response> => requestGet(`${GATE_APP.admin}/${serviceModule}/${id}/endJob`);
}

export default new Job(GATE_APP.admin, serviceModule);
