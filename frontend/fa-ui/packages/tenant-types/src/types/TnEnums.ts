namespace TnEnums {
  // ------------------------------------ BASE ------------------------------------
  export enum TenantStatusEnum {
    NORMAL = 1,
    STOP = 2,
  }

  export enum PublishStatusEnum {
    NOT_SCAN = 0,
    SCANNED = 1,
    PUBLISHED = 2,
  }

  export const PublishStatusEnumMap = {
    [PublishStatusEnum.NOT_SCAN]: '未扫码创建',
    [PublishStatusEnum.SCANNED]: '已扫码未上线',
    [PublishStatusEnum.PUBLISHED]: '已发布上线',
  }

  // ------------------------------------ RBAC ------------------------------------
  export enum TenantRbacMenuLevelEnum {
    APP = 0,
    MENU = 1,
    BUTTON = 9,
  }

  export const TenantRbacMenuLevelEnumMap = {
    [TenantRbacMenuLevelEnum.APP]: '模块',
    [TenantRbacMenuLevelEnum.MENU]: '菜单',
    [TenantRbacMenuLevelEnum.BUTTON]: '按钮',
  };

  export enum TenantRbacLinkTypeEnum {
    INNER = 1,
    OUT = 2,
  }

}

export default TnEnums;
