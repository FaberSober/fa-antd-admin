import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ 好友分组 操作接口 ------------------------------------------ */
class FriendGroupApi extends BaseApi<Im.ImFriendGroup, number> {}

export default new FriendGroupApi(GATE_APP.im.friend, 'friendGroup');
