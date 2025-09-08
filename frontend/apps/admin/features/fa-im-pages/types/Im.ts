import { Fa } from '@fa/ui';
import ImEnums from './ImEnums';

// IM模块相关的类型定义
namespace Im {

  /** IM-会话表 */
  export interface ImConversation extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 类型：1-单聊/2-群聊 */
    type: number;
    /** 群聊名称 */
    title: string;
    /** 单聊对方用户ID */
    toUserId?: string;
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
    type: number;
    /** 消息内容 */
    content: string;
    /** 附件ID */
    fileId: string;
    /** 是否撤回 */
    isWithdrawn: boolean;
    /** 删除状态 */
    deleted?: boolean;
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
}

export default Im;
