import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ IM-消息表 操作接口 ------------------------------------------ */
class Api extends BaseApi<Im.ImMessage, string> {}

export default new Api(GATE_APP.im.core, 'imMessage');
