import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Flow } from '@/types';

/** ------------------------------------------ FLOW-流程定义 操作接口 ------------------------------------------ */
class Api extends BaseApi<Flow.FlowProcess, number> {}

export default new Api(GATE_APP.flow.manage, 'flowProcess');
