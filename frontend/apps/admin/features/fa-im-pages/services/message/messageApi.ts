// messageApi.ts - 消息相关API服务
import { request } from '@fa/ui';
import { ImMessage, ImUserMessage } from '../../types/message/ImMessage';

/**
 * 消息管理API
 */
export interface MessageApi {
  // 获取消息列表
  listMessages: (params?: any) => Promise<any>;
  
  // 发送消息
  sendMessage: (message: ImMessage) => Promise<any>;
  
  // 撤回消息
  recallMessage: (id: number) => Promise<any>;
  
  // 标记消息已读
  markMessageRead: (messageId: string, userId: number) => Promise<any>;
  
  // 获取用户消息状态列表
  listUserMessages: (params?: any) => Promise<any>;
}

const messageApi: MessageApi = {
  listMessages: (params) => {
    return request.get('/im/message/list', { params });
  },
  
  sendMessage: (message) => {
    return request.post('/im/message/send', message);
  },
  
  recallMessage: (id) => {
    return request.put(`/im/message/recall/${id}`);
  },
  
  markMessageRead: (messageId, userId) => {
    return request.put(`/im/message/read/${messageId}/${userId}`);
  },
  
  listUserMessages: (params) => {
    return request.get('/im/message/user/list', { params });
  }
};

export default messageApi;