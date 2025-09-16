import { GATE_APP } from '@/configs';
import { BaseApi, Fa } from '@fa/ui';
import { Im } from '@/types';

/** ------------------------------------------ IM-会话表 操作接口 ------------------------------------------ */
class Api extends BaseApi<Im.ImConversation, string> {

  /** 开启新单聊 */
  createNewSingle = (params: {toUserId: string}): Promise<Fa.Ret<Im.ImConversation>> => this.post('createNewSingle', params);

  /** 开启新群聊 */
  createNewGroup = (params: {userIds: string[]}): Promise<Fa.Ret<Im.ImConversation>> => this.post('createNewGroup', params);

  /** 加入群聊 */
  addGroupUsers = (params: {userIds: string[], conversationId: string}): Promise<Fa.Ret<Im.ImConversation>> => this.post('addGroupUsers', params);

  /** 移出群聊 */
  removeGroupUsers = (params: {userIds: string[], conversationId: string}): Promise<Fa.Ret<Im.ImConversation>> => this.post('removeGroupUsers', params);

  /** 重命名群聊 */
  renameGroup = (params: {title: string, conversationId: string}): Promise<Fa.Ret<Im.ImConversation>> => this.post('renameGroup', params);

  /** 聊天查询 */
  listQuery = (params: {title?: string, conversationId?: string}): Promise<Fa.Ret<Im.ImConversationRetVo[]>> => this.post('listQuery', params);

  /** 发送消息 */
  sendMsg = (params: Im.ImConversationSendMsgReqVo): Promise<Fa.Ret<Im.ImMessage>> => this.post('sendMsg', params);

  /** 更新聊天已读 */
  updateConversationRead = (params: {conversationId: string}): Promise<Fa.Ret<boolean>> => this.post('updateConversationRead', params);

  /** 获取未读消息数量 */
  getUnreadCount = (): Promise<Fa.Ret<number>> => this.get('getUnreadCount');

  /** 退出群聊 */
  exitGroupChat = (conversationId: string): Promise<Fa.Ret<boolean>> => this.get(`exitGroupChat/${conversationId}`);

  /** 获取聊天参与者 */
  getParticipant = (params: Fa.BasePageQuery<{conversationId: string, name?: string}>): Promise<Fa.Ret<Fa.Page<Im.ImParticipant>>> => this.post('getParticipant', params);

}

export default new Api(GATE_APP.im.core, 'imConversation');
