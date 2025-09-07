import { GATE_APP } from '@/configs';
import { BaseApi } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ 群成员 操作接口 ------------------------------------------ */
class GroupMemberApi extends BaseApi<Im.ImGroupMember, number> {}

export default new GroupMemberApi(GATE_APP.im.group, 'groupMember');
