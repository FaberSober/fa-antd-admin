import { Fa } from '@fa/ui';
import ImEnums from './ImEnums';

// IM模块相关的类型定义
namespace Im {

  /** IM-会话表 */
  export interface ImConversation extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 类型：1-单聊/2-群聊 */
    type: ImEnums.ImConversationTypeEnum;
    /** 群聊名称 */
    title: string;
    /** 聊天用户ID集合 */
    userIds: string;
    /** 封面图标JSONArray */
    cover: string;
    /** 最新一条消息 */
    lastMsg?: string;
  }

  /** IM-消息表 */
  export interface ImMessage extends Fa.BaseCrtEntity {
    /** ID */
    id: string;
    /** 会话ID */
    conversationId: string;
    /** 发送用户ID */
    senderId: string;
    /** 类型：1-文本/2-图片/3-视频/4-文件 */
    type: ImEnums.ImMessageTypeEnum;
    /** 消息内容 */
    content: string;
    /** 附件ID */
    fileId?: string;
    /** 是否撤回 */
    isWithdrawn: boolean;
    /** 删除状态 */
    deleted?: boolean;
    // ------------- show cols -------------
    /** 发送用户头像 */
    senderUserImg: string;
  }

  export interface ImMessageShow extends ImMessage {
    /** sending */
    sending: boolean;
    /** send error msg */
    error?: string;
  }


  /** IM-消息已读状态表 */
  export interface ImMessageRead {
    /** ID */
    id: string;
    /** 消息ID */
    messageId: string;
    /** 用户ID */
    userId: string;
    /** 读取时间 */
    readAt: string;
  }

  /** IM-会话参与者表 */
  export interface ImParticipant extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 会话ID */
    conversationId: string;
    /** 用户ID */
    userId: string;
    /** 最后一条已读消息ID */
    lastReadMessageId: string;
    /** 未读消息数量 */
    unreadCount: number;
    /** 用户标题 */
    title: string;
  }

  // ----------------------------------------- request -----------------------------------------
  export interface ImConversationSendMsgReqVo {
    /** 会话ID */
    conversationId: string;
    /** 消息类型 */
    type: ImEnums.ImMessageTypeEnum;
    /** 消息内容 */
    content: string;
  }

  // ----------------------------------------- response -----------------------------------------
  export interface ImConversationRetVo extends ImConversation {
    /** 最后一条已读消息ID */
    lastReadMessageId: string;
    /** 未读消息数量 */
    unreadCount: number;
    /** 用户标题 */
    convTitle: string;
  }
}

export default Im;
