// groupApi.ts - 群组相关API服务
import { request } from '@fa/ui';
import { ImGroup, ImGroupMember } from '../../types/group/ImGroup';

/**
 * 群组管理API
 */
export interface GroupApi {
  // 获取群组列表
  listGroups: (params?: any) => Promise<any>;
  
  // 创建群组
  createGroup: (group: ImGroup) => Promise<any>;
  
  // 更新群组
  updateGroup: (group: ImGroup) => Promise<any>;
  
  // 解散群组
  dismissGroup: (id: number) => Promise<any>;
  
  // 获取群成员列表
  listGroupMembers: (params?: any) => Promise<any>;
  
  // 添加群成员
  addGroupMember: (member: ImGroupMember) => Promise<any>;
  
  // 移除群成员
  removeGroupMember: (id: number) => Promise<any>;
}

const groupApi: GroupApi = {
  listGroups: (params) => {
    return request.get('/im/group/list', { params });
  },
  
  createGroup: (group) => {
    return request.post('/im/group/save', group);
  },
  
  updateGroup: (group) => {
    return request.put('/im/group/update', group);
  },
  
  dismissGroup: (id) => {
    return request.delete(`/im/group/remove/${id}`);
  },
  
  listGroupMembers: (params) => {
    return request.get('/im/group/member/list', { params });
  },
  
  addGroupMember: (member) => {
    return request.post('/im/group/member/save', member);
  },
  
  removeGroupMember: (id) => {
    return request.delete(`/im/group/member/remove/${id}`);
  }
};

export default groupApi;