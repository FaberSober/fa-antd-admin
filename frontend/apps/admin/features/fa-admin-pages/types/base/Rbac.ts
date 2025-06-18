import type { Fa, FaEnums } from '@fa/ui';

namespace Rbac {
  /** BASE-权限表 */
  export interface RbacMenu extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 父级ID */
    parentId: string;
    /** 模块：1-web/2-app */
    scope: FaEnums.RbacMenuScopeEnum;
    /** 名称 */
    name: string;
    /** 排序 */
    sort: number;
    /** 菜单等级：0-模块/1-一级菜单/2-二级菜单/3-三级菜单/9-按钮 */
    level: FaEnums.RbacMenuLevelEnum;
    /** 图标标识 */
    icon: string;
    /** 是否启用0-禁用/1-启用 */
    status: boolean;
    /** 链接类型【1-内部链接(默认)2-外部链接】 */
    linkType: FaEnums.RbacLinkTypeEnum;
    /** 链接地址【pathinfo#method】 */
    linkUrl: string;
  }

  /** BASE-角色表 */
  export interface RbacRole extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 角色名称 */
    name: string;
    /** 角色描述 */
    remarks: string;
    /** 是否启用 */
    status: boolean;
  }

  /** BASE-角色权限对应表 */
  export interface RbacRoleMenu extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 角色ID */
    roleId: string;
    /** 权限ID */
    menuId: string;
    /** 是否半勾选0-否/1-是 */
    halfChecked: boolean;
  }

  /** BASE-用户角色关联表 */
  export interface RbacUserRole extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 用户ID */
    userId: string;
    /** 角色ID */
    roleId: string;
  }

  // ------------------------------------------------- VO -------------------------------------------------
  export interface RoleMenuVo {
    roleId: string;
    checkedMenuIds: number[];
  }

  export interface RbacUserRoleRetVo extends RbacUserRole {
    name: string;
    username: string;
  }

  // ------------------------------------------------- VO-Query -------------------------------------------------
  export interface RbacUserRoleQueryVo {
    roleId: string;
    name?: string;
    username?: string;
  }
}

export default Rbac;
