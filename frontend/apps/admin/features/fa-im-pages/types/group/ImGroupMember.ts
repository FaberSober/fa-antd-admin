// types/group/ImGroupMember.ts
export interface ImGroupMember {
  id: number;              // 主键ID
  groupId: string;         // 群ID
  userId: number;          // 用户ID
  userNickname?: string;   // 群内昵称
  role?: number;           // 角色: 1成员 2管理员 3群主
  status?: number;         // 状态: 1正常 2退出
  joinTime?: string;       // 加入时间
  crtTime?: string;        // 创建时间
  updTime?: string;        // 更新时间
}