import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import type { Demo } from '@/types';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<Demo.Student, number> {}

export default new Api(GATE_APP.demo, 'student');
