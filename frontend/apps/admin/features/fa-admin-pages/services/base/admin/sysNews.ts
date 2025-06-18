import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import type { Admin } from '@/types';

/** ------------------------------------------ BASE-系统-新闻 操作接口 ------------------------------------------ */
class Api extends BaseApi<Admin.SysNews, number> {}

export default new Api(GATE_APP.admin, 'sysNews');
