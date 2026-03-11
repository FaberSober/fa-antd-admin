import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ IM-会话参与者表 操作接口 ------------------------------------------ */
class Api extends BaseApi<Im.ImParticipant, string> {}

export default new Api(GATE_APP.im.core, 'imParticipant');
