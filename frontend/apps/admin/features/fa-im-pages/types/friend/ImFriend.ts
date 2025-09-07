// types/friend/ImFriend.ts
export interface ImFriend {
  id: number;              // 主键ID
  userId: number;          // 用户ID
  friendId: number;        // 好友ID
  friendGroupId?: number;  // 好友分组ID
  remark?: string;         // 好友备注
  deleted?: boolean;       // 删除状态
  crtTime?: string;        // 创建时间
  updTime?: string;        // 更新时间
}