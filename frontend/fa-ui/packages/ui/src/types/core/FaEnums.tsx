import React from 'react'
import { Badge } from "antd";


namespace FaEnums {
  // ------------------------------------ BASE ------------------------------------
  export enum SexEnum {
    FEMALE = 0,
    MALE = 1,
    UNKNOWN = 2,
  }

  export enum UserWorkStatusEnum {
    ON_JOB = 0,
    ASK_LEAVE = 1,
    DEPART = 2,
  }

  export enum FileSaveDriveEnum {
    LOCAL = 1,
    QINIU = 2,
    ALI = 3,
    TX = 4,
  }

  export enum LogCrudEnum {
    C = 'C',
    R = 'R',
    U = 'U',
    D = 'D',
  }

  export const LogCrudEnumMap = {
    [LogCrudEnum.C]: '新增',
    [LogCrudEnum.R]: '读取',
    [LogCrudEnum.U]: '更新',
    [LogCrudEnum.D]: '删除',
  };

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
    SCENE = '2',
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

  /**
   *     NUM(1, "必须包含数字"),
   *     CHAR(2, "必须包含字母"),
   *     NUM_CHAR(3, "必须包含数字+字母"),
   *     NUM_CHAR_SPEC(4, "必须包含数字+字母+特殊字符");
   */
  export enum ConfigSysSafePasswordTypeEnum {
    NUM = 1,
    CHAR = 2,
    NUM_CHAR = 3,
    NUM_CHAR_SPEC = 4,
  }

  export enum DocumentType {
    word = 'word',
    cell = 'cell',
    slide = 'slide',
  }

  // ------------------------------------ RBAC ------------------------------------
  export enum RbacMenuScopeEnum {
    WEB = 1,
    APP = 2,
  }

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
    PATH = 3,
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

  // ------------------------------------ DISK ------------------------------------
  export enum StoreBucketUserTypeEnum {
    CREATOR = 1, // 创建者
    USER = 2, // 操作者
  }

  // ------------------------------------ 审核流程 ------------------------------------
  export enum AuditEnum {
    TODO = 0,
    PASS = 1,
    NO_PASS = 2,
  }

  export const AuditEnumMap = {
    [AuditEnum.TODO]: '待审核',
    [AuditEnum.PASS]: '通过',
    [AuditEnum.NO_PASS]: '不通过',
  }

  export const AuditEnumBadge = {
    [AuditEnum.TODO]: <Badge status="processing" text="待审核" />,
    [AuditEnum.PASS]: <Badge status="success" text="通过" />,
    [AuditEnum.NO_PASS]: <Badge status="error" text="未通过" />,
  }

}

export default FaEnums;
