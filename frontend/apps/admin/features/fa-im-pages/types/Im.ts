// IM模块相关的类型定义
namespace Im {
  // ------------------------------------- Friend -------------------------------------

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

  // types/friend/ImFriendGroup.ts
  export interface ImFriendGroup {
    id: number;              // 主键ID
    userId: number;          // 用户ID
    groupName: string;       // 分组名称
    sort?: number;           // 排序
    crtTime?: string;        // 创建时间
    updTime?: string;        // 更新时间
  }

  // ------------------------------------- Group -------------------------------------

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

  // ------------------------------------- Message -------------------------------------

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

  // ------------------------------------- Session -------------------------------------

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
}

export default Im;
