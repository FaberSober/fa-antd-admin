import {GATE_APP} from '@/configs/server.config';
import {BaseTreeApi} from '@/services/base';
import * as Demo from "../../../types/demo";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'tree';

class Api extends BaseTreeApi<Demo.Tree, number> {
}

export default new Api(GATE_APP.demo, serviceModule);
