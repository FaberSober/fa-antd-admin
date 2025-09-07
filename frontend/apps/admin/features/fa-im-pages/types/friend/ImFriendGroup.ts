// types/friend/ImFriendGroup.ts
export interface ImFriendGroup {
  id: number;              // 主键ID
  userId: number;          // 用户ID
  groupName: string;       // 分组名称
  sort?: number;           // 排序
  crtTime?: string;        // 创建时间
  updTime?: string;        // 更新时间
}