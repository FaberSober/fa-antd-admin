import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import Admin from '@/props/admin';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class MenuBlockApi extends BaseApi<Admin.MenuBlock, number> {}

export default new MenuBlockApi(GATE_APP.admin, 'menuBlock');
