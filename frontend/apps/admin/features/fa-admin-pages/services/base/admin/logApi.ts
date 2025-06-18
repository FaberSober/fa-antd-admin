import { GATE_APP } from '@/configs';
import { BaseApi, type Fa } from '@fa/ui';
import type { Admin } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class LogApiApi extends BaseApi<Admin.LogApi, string> {
  /** 清空日志 */
  deleteAll = (): Promise<Fa.Ret> => this.delete('deleteAll');
}

export default new LogApiApi(GATE_APP.admin, 'logApi');
