import FaberBase from '@/props/base/FaberBase';

namespace Rbac {
  /** BASE-权限表 */
  export interface RbacMenu extends FaberBase.BaseDelEntity {
    /** ID */
    id: number;
    /** 父级ID */
    parentId: string;
    /** 名称 */
    name: string;
    /** 菜单等级：0-模块/1-一级菜单/2-二级菜单/3-三级菜单/9-按钮 */
    level: string;
    /** ID路径【id-id-id】 */
    path: string;
    /** 图标标识 */
    icon: string;
    /** 是否启用0-禁用/1-启用 */
    status: string;
    /** 链接类型【1-内部链接(默认)2-外部链接】 */
    linkType: string;
    /** 链接地址【pathinfo#method】 */
    linkUrl: string;
  }

  /** BASE-角色表 */
  export interface RbacRole extends FaberBase.BaseDelEntity {
    /** ID */
    id: number;
    /** 角色名称 */
    name: string;
    /** 角色描述 */
    remarks: string;
    /** 是否启用 */
    status: string;
  }

  /** BASE-角色权限对应表 */
  export interface RbacRoleMenu extends FaberBase.BaseDelEntity {
    /** ID */
    id: number;
    /** 角色ID */
    roleId: string;
    /** 权限ID */
    menuId: string;
  }

  /** BASE-用户角色关联表 */
  export interface RbacUserRole extends FaberBase.BaseDelEntity {
    /** ID */
    id: number;
    /** 用户ID */
    userId: string;
    /** 角色ID */
    roleId: string;
  }

}

export default Rbac;
