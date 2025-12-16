import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Flow } from '@/types';

/** ------------------------------------------ FLOW-流程表单 操作接口 ------------------------------------------ */
class Api extends BaseApi<Flow.FlowForm, number> {}

export default new Api(GATE_APP.flow.form, 'flowForm');
