// types/session/ImChatSession.ts
export interface ImChatSession {
  id: number;                    // 主键ID
  sessionId: string;             // 会话ID
  sessionType: number;           // 会话类型: 1单聊 2群聊
  sessionName?: string;          // 会话名称
  sessionAvatar?: string;        // 会话头像
  userIds: string;               // 参与用户ID列表(逗号分隔)
  lastMessageId?: number;        // 最后消息ID
  lastMessageTime?: string;      // 最后消息时间
  lastMessageContent?: string;   // 最后消息内容
  unreadCount: number;           // 未读消息数
  deleted?: boolean;             // 删除状态
  crtTime?: string;              // 创建时间
  updTime?: string;              // 更新时间
}