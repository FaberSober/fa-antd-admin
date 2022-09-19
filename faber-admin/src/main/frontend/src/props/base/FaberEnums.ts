namespace FaberEnums {

  // ------------------------------------ BASE ------------------------------------
  export enum BoolEnum {
    NO = 0,
    YES = 1,
  }

  export enum DelStateEnum {
    AVAILABLE = 0,
    DELETED = 1,
  }

  // ------------------------------------ RBAC ------------------------------------
  export enum RbacMenuLevelEnum {
    APP = 0,
    LEVEL_1 = 1,
    LEVEL_2 = 2,
    LEVEL_3 = 3,
    BUTTON = 9,
  }

  export enum RbacLinkTypeEnum {
    INNER = 1,
    OUT = 2,
  }

}

export default FaberEnums;
