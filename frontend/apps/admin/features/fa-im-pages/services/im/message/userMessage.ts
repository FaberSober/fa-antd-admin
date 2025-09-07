import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ 用户消息状态 操作接口 ------------------------------------------ */
class UserMessageApi extends BaseApi<Im.ImUserMessage, number> {}

export default new UserMessageApi(GATE_APP.im.message, 'userMessage');
