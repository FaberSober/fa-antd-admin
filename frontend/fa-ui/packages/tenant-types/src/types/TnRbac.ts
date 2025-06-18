import { Fa } from '@fa/ui';
import TnEnums from './TnEnums';

namespace TnRbac {
  /** 租户-权限-菜单表 */
  export interface TenantRbacMenu extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 父级ID */
    parentId: string;
    /** 名称 */
    name: string;
    /** 排序 */
    sort: number;
    /** 菜单等级：0-模块/1-菜单/9-按钮 */
    level: TnEnums.TenantRbacMenuLevelEnum;
    /** 图标标识 */
    icon: string;
    /** 是否启用0-禁用/1-启用 */
    status: boolean;
    /** 链接类型【1-内部链接(默认)2-外部链接】 */
    linkType: TnEnums.TenantRbacLinkTypeEnum;
    /** 链接地址【pathinfo#method】 */
    linkUrl: string;
  }

  /** 租户-权限-角色表 */
  export interface TenantRbacRole extends Fa.TnBaseDelEntity {
    /** ID */
    id: string;
    /** 角色名称 */
    name: string;
    /** 角色描述 */
    remarks: string;
    /** 是否启用 */
    status: boolean;
  }

  /** 租户-权限-角色权限对应表 */
  export interface TenantRbacRoleMenu extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 角色ID */
    roleId: string;
    /** 权限ID */
    menuId: string;
    /** 是否半勾选 */
    halfChecked: boolean;
  }

  /** 租户-权限-租户授权权限表 */
  export interface TenantRbacTenantMenu extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 租户ID */
    tenantId: string;
    /** 权限ID */
    menuId: string;
    /** 是否半勾选 */
    halfChecked: boolean;
  }

  /** 租户-权限-用户角色关联表 */
  export interface TenantRbacUserRole extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 用户ID */
    userId: string;
    /** 角色ID */
    roleId: string;
  }

  // ------------------------------------------------- VO -------------------------------------------------
  export interface TenantRoleMenuVo {
    roleId: string;
    checkedMenuIds: string[];
    halfCheckedMenuIds: string[];
  }

  export interface TenantTenantMenuVo {
    tenantId: string;
    checkedMenuIds: string[];
    halfCheckedMenuIds: string[];
  }

  export interface TenantRbacUserRoleRetVo extends TenantRbacUserRole {
    name: string;
    username: string;
  }

  // ------------------------------------------------- VO-Query -------------------------------------------------
  export interface TenantRbacUserRoleQueryVo extends Fa.BasePageProps {
    roleId: string;
    name?: string;
    username?: string;
  }
}

export default TnRbac;
