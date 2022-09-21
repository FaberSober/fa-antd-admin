import { GATE_APP } from '@/configs/server.config';
import Admin from '@/props/admin';
import { BaseApi } from '@/services/base';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'element';

class Element extends BaseApi<Admin.Element, number, Admin.ElementWebVO> {}

export default new Element(GATE_APP.admin, serviceModule);
