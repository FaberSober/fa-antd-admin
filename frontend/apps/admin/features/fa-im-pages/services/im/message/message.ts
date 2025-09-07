import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ 消息 操作接口 ------------------------------------------ */
class MessageApi extends BaseApi<Im.ImMessage, number> {}

export default new MessageApi(GATE_APP.im.message, 'message');
