import { GATE_APP } from '@/configs';
import { BaseTreeApi, Fa } from '@fa/ui';
import { Admin } from '@/types';

/** ------------------------------------------ BASE-字典值 操作接口 ------------------------------------------ */
class Api extends BaseTreeApi<Admin.DictData, number> {

  /** 切换默认 */
  toggleDefaultById = (id: number): Promise<Fa.Ret<boolean>> => this.get(`toggleDefaultById/${id}`);

}

export default new Api(GATE_APP.admin, 'dictData');
