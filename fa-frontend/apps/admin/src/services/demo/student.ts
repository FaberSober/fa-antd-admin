import { GATE_APP } from '@/configs/server.config';
import { BaseApi } from '@/services/base';
import * as Demo from '../../../types/demo';

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
class Api extends BaseApi<Demo.Student, number> {}

export default new Api(GATE_APP.demo, 'student');
