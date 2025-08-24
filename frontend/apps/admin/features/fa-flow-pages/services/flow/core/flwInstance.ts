import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Flow } from '@/types';

/** ------------------------------------------ 流程实例表 操作接口 ------------------------------------------ */
class Api extends BaseApi<Flow.FlwInstance, string> {}

export default new Api(GATE_APP.flow.core, 'flwInstance');
