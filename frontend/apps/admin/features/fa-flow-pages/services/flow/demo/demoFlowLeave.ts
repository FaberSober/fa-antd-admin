import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Flow } from '@/types';

/** ------------------------------------------ DEMO-请假流程 操作接口 ------------------------------------------ */
class Api extends BaseApi<Flow.DemoFlowLeave, number> {}

export default new Api(GATE_APP.flow.demo, 'demoFlowLeave');
