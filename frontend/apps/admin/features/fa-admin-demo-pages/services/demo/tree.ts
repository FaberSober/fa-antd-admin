import { GATE_APP } from '@/configs';
import { BaseTreeApi } from '@fa/ui';
import type { Demo } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'tree';

class Api extends BaseTreeApi<Demo.Tree, number> {}

export default new Api(GATE_APP.demo, serviceModule);
