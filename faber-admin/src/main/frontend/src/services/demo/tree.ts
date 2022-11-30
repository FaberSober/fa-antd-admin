import {GATE_APP} from '@/configs/server.config';
import {BaseTreeApi} from '@/services/base';
import Demo from "@/props/demo";

/** ------------------------------------------ xx 操作接口 ------------------------------------------ */
const serviceModule = 'tree';

class Tree extends BaseTreeApi<Demo.Tree, number> {
}

export default new Tree(GATE_APP.demo, serviceModule);
