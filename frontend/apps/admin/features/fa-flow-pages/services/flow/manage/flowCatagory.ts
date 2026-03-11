import { GATE_APP } from '@/configs';
import { BaseTreeApi } from '@fa/ui';
import { Flow } from '@/types';

/** ------------------------------------------ FLOW-流程分类 操作接口 ------------------------------------------ */
class Api extends BaseTreeApi<Flow.FlowCatagory, number> {}

export default new Api(GATE_APP.flow.manage, 'flowCatagory');
