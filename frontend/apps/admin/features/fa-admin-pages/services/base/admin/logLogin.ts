import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import type { Admin, Fa } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class LogLoginApi extends BaseApi<Admin.LogLogin, number> {
  /** 按天统计 */
  countByDay = (params: { startDate: string; endDate: string }): Promise<Fa.Ret<Fa.ChartSeriesVo[]>> => this.post('countByDay', params);

  /** 按省份统计 */
  countByPro = (): Promise<Fa.Ret<Fa.ChartSeriesVo[]>> => this.get('countByPro');
}

export default new LogLoginApi(GATE_APP.admin, 'logLogin');
