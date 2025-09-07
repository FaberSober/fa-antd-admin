// types/message/ImMessage.ts
export interface ImMessage {
  id: number;              // 主键ID
  messageId: string;       // 消息ID
  sessionId: string;       // 会话ID
  senderId: number;        // 发送者ID
  messageType: number;     // 消息类型: 1文本 2图片 3文件 4语音 5视频 6表情 7混合
  content?: string;        // 消息内容
  fileId?: string;         // 文件ID
  fileName?: string;       // 文件名称
  fileSize?: number;       // 文件大小
  fileUrl?: string;        // 文件URL
  deleted?: boolean;       // 删除状态
  sendTime?: string;       // 发送时间
  crtTime?: string;        // 创建时间
  updTime?: string;        // 更新时间
}