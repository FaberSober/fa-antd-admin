// friendApi.ts - 好友相关API服务
import { request } from '@fa/ui';
import { ImFriend, ImFriendGroup } from '../../types/friend/ImFriend';

/**
 * 好友管理API
 */
export interface FriendApi {
  // 获取好友列表
  listFriends: (params?: any) => Promise<any>;
  
  // 添加好友
  addFriend: (friend: ImFriend) => Promise<any>;
  
  // 删除好友
  deleteFriend: (id: number) => Promise<any>;
  
  // 获取好友分组列表
  listFriendGroups: (params?: any) => Promise<any>;
  
  // 添加好友分组
  addFriendGroup: (group: ImFriendGroup) => Promise<any>;
  
  // 更新好友分组
  updateFriendGroup: (group: ImFriendGroup) => Promise<any>;
  
  // 删除好友分组
  deleteFriendGroup: (id: number) => Promise<any>;
}

const friendApi: FriendApi = {
  listFriends: (params) => {
    return request.get('/im/friend/list', { params });
  },
  
  addFriend: (friend) => {
    return request.post('/im/friend/save', friend);
  },
  
  deleteFriend: (id) => {
    return request.delete(`/im/friend/remove/${id}`);
  },
  
  listFriendGroups: (params) => {
    return request.get('/im/friend/group/list', { params });
  },
  
  addFriendGroup: (group) => {
    return request.post('/im/friend/group/save', group);
  },
  
  updateFriendGroup: (group) => {
    return request.put('/im/friend/group/update', group);
  },
  
  deleteFriendGroup: (id) => {
    return request.delete(`/im/friend/group/remove/${id}`);
  }
};

export default friendApi;