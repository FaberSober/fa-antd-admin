import {GATE_APP} from '@/configs/server.config';
import Admin from '@/props/admin';
import {BaseApi} from '@/services/base';
import {Fa} from "@/props/base";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'job';

class Job extends BaseApi<Admin.Job, number> {
	/** 获取唯一实体 */
	runOneTime = (id: number): Promise<Fa.Ret> => this.get(`runOneTime/${id}`);

	/** 获取唯一实体 */
	startJob = (id: number): Promise<Fa.Ret> => this.get(`startJob/${id}`);

	/** 获取唯一实体 */
	endJob = (id: number): Promise<Fa.Ret> => this.get(`endJob/${id}`);

	/** 获取cron最近5次运行时间 */
	quartzLatest = (cron: string, times: number): Promise<Fa.Ret<string[]>> =>
		this.post(
			`quartz/latest`,
			{ cron, times },
			{
				headers: { hideErrorMsg: '1' },
			},
		);
}

export default new Job(GATE_APP.admin, serviceModule);
