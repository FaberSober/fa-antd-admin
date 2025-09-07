// sessionApi.ts - 会话相关API服务
import { request } from '@fa/ui';
import { ImChatSession } from '../../types/session/ImChatSession';

/**
 * 会话管理API
 */
export interface SessionApi {
  // 获取会话列表
  listSessions: (params?: any) => Promise<any>;
  
  // 创建会话
  createSession: (session: ImChatSession) => Promise<any>;
  
  // 更新会话
  updateSession: (session: ImChatSession) => Promise<any>;
  
  // 删除会话
  deleteSession: (id: number) => Promise<any>;
}

const sessionApi: SessionApi = {
  listSessions: (params) => {
    return request.get('/im/session/list', { params });
  },
  
  createSession: (session) => {
    return request.post('/im/session/save', session);
  },
  
  updateSession: (session) => {
    return request.put('/im/session/update', session);
  },
  
  deleteSession: (id) => {
    return request.delete(`/im/session/remove/${id}`);
  }
};

export default sessionApi;