import { request } from '../common/request';
import type { TenantUser } from '../types/tenant';

export function getMyTenants(): Promise<TenantUser[]> {
  return request<TenantUser[]>({
    url: '/base/tn/tenantUser/myTenants',
    method: 'GET',
    skipTenant: true,
  });
}
