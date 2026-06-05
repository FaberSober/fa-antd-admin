import type { Fa } from '@fa/ui';

namespace Tn {
  /** 租户 */
  export interface Tenant extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 租户编码 */
    code: string;
    /** 租户名称 */
    name: string;
    /** 租户简称 */
    shortName: string;
    /** 状态 */
    status: boolean;
    /** 到期时间 */
    expireTime: string;
    /** 联系人 */
    contactName: string;
    /** 联系电话 */
    contactPhone: string;
    /** 联系邮箱 */
    contactEmail: string;
    /** 排序 */
    sort: number;
    /** 描述 */
    description: string;
  }

  /** 租户用户关联 */
  export interface TenantUser extends Fa.BaseDelEntity {
    /** ID */
    id: string;
    /** 租户ID */
    tenantId: string;
    /** 租户名称 */
    tenantName: string;
    /** 用户ID */
    userId: string;
    /** 用户名称 */
    userName: string;
    /** 是否租户管理员 */
    isAdmin: boolean;
    /** 状态 */
    status: boolean;
    /** 排序 */
    sort: number;
    /** 描述 */
    description: string;
  }
}

export default Tn;
