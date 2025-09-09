namespace ImEnums {

  // ------------------------------------ IM ------------------------------------

  export enum ImConversationTypeEnum {
    /** 单聊 */
    SINGLE = 1,
    /** 群聊 */
    GROUP = 2,
  }

  /**
   * 消息类型枚举
   * 类型：1-文本/2-图片/3-视频/4-文件
   */
  export enum ImMessageTypeEnum {
    /** 文本 */
    TEXT = 1,
    /** 图片 */
    IMAGE = 2,
    /** 视频 */
    VIDEO = 3,
    /** 文件 */
    FILE = 4,
  }

  /**
   * 消息类型描述映射
   */
  export const ImMessageTypeDescMap = {
    [ImMessageTypeEnum.TEXT]: '文本',
    [ImMessageTypeEnum.IMAGE]: '图片',
    [ImMessageTypeEnum.VIDEO]: '视频',
    [ImMessageTypeEnum.FILE]: '文件',
  };

}

export default ImEnums;
