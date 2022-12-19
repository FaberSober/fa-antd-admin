namespace FaEnums {
  // ------------------------------------ BASE ------------------------------------
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
  };

  export enum ConfigType {
    TABLE_COLUMNS = '1',
  }

  // ------------------------------------ Admin ------------------------------------
  export enum AreaLevel {
    NATION = -1,
    PROVINCE = 0,
    CITY = 1,
    COUNTY = 2,
    COUNTRY = 3,
    VILLAGE = 4,
  }

  export enum DepartmentType {
    CORP = 'CORP',
    DEPT = 'DEPT',
    TEAM = 'TEAM',
  }

  // ------------------------------------ RBAC ------------------------------------
  export enum RbacMenuLevelEnum {
    APP = 0,
    MENU = 1,
    BUTTON = 9,
  }

  export const RbacMenuLevelEnumMap = {
    [RbacMenuLevelEnum.APP]: '模块',
    [RbacMenuLevelEnum.MENU]: '菜单',
    [RbacMenuLevelEnum.BUTTON]: '按钮',
  };

  export enum RbacLinkTypeEnum {
    INNER = 1,
    OUT = 2,
  }

  export enum JobLogStatusEnum {
    DOING = 1, // 执行中
    DONE = 2, // 成功
    ERROR = 9, // 失败
  }

  export const JOB_LOG_STATUS_MAP = {
    [JobLogStatusEnum.DOING]: '执行中',
    [JobLogStatusEnum.DONE]: '成功',
    [JobLogStatusEnum.ERROR]: '失败',
  };
}

export default FaEnums;
