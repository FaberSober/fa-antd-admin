import { Fa } from '@fa/ui';

// IM模块相关的类型定义
namespace Im {
  // ------------------------------------- Friend -------------------------------------

  /** 用户好友关系表 */
  export interface ImFriend extends Fa.BaseDelEntity {
    /** 主键ID */
    id: string;
    /** 用户ID */
    userId: string;
    /** 好友ID */
    friendId: string;
    /** 好友分组ID */
    friendGroupId: string;
    /** 好友备注 */
    remark: string;
  }

  /** 好友分组表 */
  export interface ImFriendGroup extends Fa.BaseDelEntity {
    /** 主键ID */
    id: string;
    /** 用户ID */
    userId: string;
    /** 分组名称 */
    groupName: string;
    /** 排序 */
    sort: number;
  }
  // ------------------------------------- Group -------------------------------------

  /** 群成员表 */
  export interface ImGroupMember extends Fa.BaseDelEntity {
    /** 主键ID */
    id: string;
    /** 群ID */
    groupId: string;
    /** 用户ID */
    userId: string;
    /** 群内昵称 */
    userNickname: string;
    /** 角色: 1成员 2管理员 3群主 */
    role: boolean;
    /** 状态: 1正常 2退出 */
    status: boolean;
    /** 加入时间 */
    joinTime: string;
  }

  /** 群聊信息表 */
  export interface ImGroup extends Fa.BaseDelEntity {
    /** 主键ID */
    id: string;
    /** 群ID */
    groupId: string;
    /** 群名称 */
    groupName: string;
    /** 群头像 */
    groupAvatar: string;
    /** 群公告 */
    groupNotice: string;
    /** 创建者ID */
    creatorId: string;
    /** 最大成员数 */
    maxMembers: number;
    /** 当前成员数 */
    currentMembers: number;
    /** 状态: 1正常 2解散 */
    status: boolean;
  }
  // ------------------------------------- Message -------------------------------------

  /** 消息表 */
  export interface ImMessage extends Fa.BaseDelEntity {
    /** 主键ID */
    id: string;
    /** 消息ID */
    messageId: string;
    /** 会话ID */
    sessionId: string;
    /** 发送者ID */
    senderId: string;
    /** 消息类型: 1文本 2图片 3文件 4语音 5视频 6表情 7混合 */
    messageType: boolean;
    /** 消息内容 */
    content: string;
    /** 文件ID */
    fileId: string;
    /** 文件名称 */
    fileName: string;
    /** 文件大小 */
    fileSize: string;
    /** 文件URL */
    fileUrl: string;
    /** 状态: 1正常 2撤回 */
    status: boolean;
    /** 发送时间 */
    sendTime: string;
  }

  /** 用户消息状态表 */
  export interface ImUserMessage extends Fa.BaseDelEntity {
    /** 主键ID */
    id: string;
    /** 消息ID */
    messageId: string;
    /** 用户ID */
    userId: string;
    /** 会话ID */
    sessionId: string;
    /** 状态: 1未读 2已读 3已撤回 */
    status: boolean;
    /** 阅读时间 */
    readTime: string;
  }

  // ------------------------------------- Session -------------------------------------

  /** 聊天会话表 */
  export interface ImChatSession extends Fa.BaseDelEntity {
    /** 主键ID */
    id: string;
    /** 会话ID */
    sessionId: string;
    /** 会话类型: 1单聊 2群聊 */
    sessionType: boolean;
    /** 会话名称 */
    sessionName: string;
    /** 会话头像 */
    sessionAvatar: string;
    /** 参与用户ID列表(逗号分隔) */
    userIds: string;
    /** 最后消息ID */
    lastMessageId: string;
    /** 最后消息时间 */
    lastMessageTime: string;
    /** 最后消息内容 */
    lastMessageContent: string;
    /** 未读消息数 */
    unreadCount: number;
  }

}

export default Im;
