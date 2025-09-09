import { GATE_APP } from '@/configs';
import { BaseApi, Fa } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ IM-会话表 操作接口 ------------------------------------------ */
class Api extends BaseApi<Im.ImConversation, string> {

  /** 开启新单聊 */
  createNewSingle = (params: {toUserId: string}): Promise<Fa.Ret<Im.ImConversation>> => this.post('createNewSingle', params);

  /** 聊天查询 */
  listQuery = (params: {title?: string}): Promise<Fa.Ret<Im.ImConversationRetVo[]>> => this.post('listQuery', params);

  /** 发送消息 */
  sendMsg = (params: Im.ImConversationSendMsgReqVo): Promise<Fa.Ret<Im.ImMessage>> => this.post('sendMsg', params);

  /** 更新聊天已读 */
  updateConversationRead = (params: {conversationId: string}): Promise<Fa.Ret<boolean>> => this.post('updateConversationRead', params);

  /** 获取未读消息数量 */
  getUnreadCount = (): Promise<Fa.Ret<number>> => this.get('getUnreadCount');

}

export default new Api(GATE_APP.im.core, 'imConversation');
