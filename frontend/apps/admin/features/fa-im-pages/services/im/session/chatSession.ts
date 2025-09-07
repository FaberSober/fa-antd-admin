import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ 聊天会话 操作接口 ------------------------------------------ */
class ChatSessionApi extends BaseApi<Im.ImChatSession, number> {}

export default new ChatSessionApi(GATE_APP.im.session, 'chatSession');
