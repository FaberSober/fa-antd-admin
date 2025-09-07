// types/group/ImGroup.ts
export interface ImGroup {
  id: number;              // 主键ID
  groupId: string;         // 群ID
  groupName: string;       // 群名称
  groupAvatar?: string;    // 群头像
  groupNotice?: string;    // 群公告
  creatorId: number;       // 创建者ID
  maxMembers?: number;     // 最大成员数
  currentMembers?: number; // 当前成员数
  status?: number;         // 状态: 1正常 2解散
  deleted?: boolean;       // 删除状态
  crtTime?: string;        // 创建时间
  updTime?: string;        // 更新时间
}