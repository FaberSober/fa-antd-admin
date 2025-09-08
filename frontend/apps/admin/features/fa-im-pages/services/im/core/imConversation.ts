import { GATE_APP } from '@/configs';
import { BaseApi, Fa } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ IM-会话表 操作接口 ------------------------------------------ */
class Api extends BaseApi<Im.ImConversation, string> {

  /** 开启新单聊 */
  createNewSingle = (params: {toUserId: string}): Promise<Fa.Ret<Im.ImConversation>> => this.post('createNewSingle', params);

  /** 聊天查询 */
  listQuery = (params: {title?: string}): Promise<Fa.Ret<Im.ImConversation[]>> => this.post('listQuery', params);

}

export default new Api(GATE_APP.im.core, 'imConversation');
