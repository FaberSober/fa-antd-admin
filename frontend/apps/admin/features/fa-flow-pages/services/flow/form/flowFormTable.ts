import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import type { Flow } from '@/types';

/** ------------------------------------------ 流程表单关联表 操作接口 ------------------------------------------ */
class Api extends BaseApi<Flow.FlowFormTable, number> {}

export default new Api(GATE_APP.flow.form, 'flowFormTable');
