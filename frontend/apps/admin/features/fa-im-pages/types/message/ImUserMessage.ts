// types/message/ImUserMessage.ts
export interface ImUserMessage {
  id: number;              // 主键ID
  messageId: string;       // 消息ID
  userId: number;          // 用户ID
  sessionId: string;       // 会话ID
  status: number;          // 状态: 1未读 2已读 3已撤回
  readTime?: string;       // 阅读时间
  crtTime?: string;        // 创建时间
  updTime?: string;        // 更新时间
}