namespace FaEnums {

  // ------------------------------------ BASE ------------------------------------
  export enum BoolEnum {
    NO = 0,
    YES = 1,
  }

  export enum DelStateEnum {
    AVAILABLE = 0,
    DELETED = 1,
  }

  export enum SexEnum {
    FEMALE = 0,
    MALE = 1,
    UNKNOWN = 2,
  }

  export enum FileSaveDriveEnum {
    LOCAL = 1,
    QINIU = 2,
    ALI = 3,
    TX = 4,
  }

  export enum EntityLogActionEnum {
    ADD = 1,
    UPDATE = 2,
    DEL = 3,
  }

  export const EntityLogActionEnumMap = {
    [FaEnums.EntityLogActionEnum.ADD]: '新增',
    [FaEnums.EntityLogActionEnum.UPDATE]: '更新',
    [FaEnums.EntityLogActionEnum.DEL]: '删除',
  }

  // ------------------------------------ RBAC ------------------------------------
  export enum RbacMenuLevelEnum {
    APP = 0,
    LEVEL_1 = 1,
    LEVEL_2 = 2,
    BUTTON = 9,
  }

  export const RbacMenuLevelEnumMap = {
    [RbacMenuLevelEnum.APP]: '模块',
    [RbacMenuLevelEnum.LEVEL_1]: '一级菜单',
    [RbacMenuLevelEnum.LEVEL_2]: '二级菜单',
    [RbacMenuLevelEnum.BUTTON]: '按钮',
  }

  export enum RbacLinkTypeEnum {
    INNER = 1,
    OUT = 2,
  }

}

export default FaEnums;
