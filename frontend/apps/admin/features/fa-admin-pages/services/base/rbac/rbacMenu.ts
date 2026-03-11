import { GATE_APP } from '@/configs';
import { BaseTreeApi } from '@fa/ui';
import type { Fa, Rbac } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class RbacMenuApi extends BaseTreeApi<Rbac.RbacMenu, string> {

  /** 查询流程菜单列表 */
  getFlowMenuList = (): Promise<Fa.Ret<Fa.Option[]>> => this.get('getFlowMenuList');

}

export default new RbacMenuApi(GATE_APP.rbac, 'rbacMenu');
