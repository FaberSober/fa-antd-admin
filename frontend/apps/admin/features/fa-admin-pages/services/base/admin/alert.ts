import { GATE_APP } from '@/configs';
import {BaseApi, Fa} from '@fa/ui';
import type { Admin } from '@/types';

/** ------------------------------------------ BASE-告警信息 操作接口 ------------------------------------------ */
class Api extends BaseApi<Admin.Alert, number> {
  selectCountOfType=(): Promise<Fa.Ret<Map<string,number>>> => this.get(`selectCountOfType`);
}

export default new Api(GATE_APP.admin, 'alert');
