import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import type { Admin } from '@/types';

/** ------------------------------------------ BASE-用户设备 操作接口 ------------------------------------------ */
class Api extends BaseApi<Admin.UserDevice, number> {}

export default new Api(GATE_APP.admin, 'userDevice');
