import type { Admin, Rbac, Tn } from '@features/fa-admin-pages/types';
import { createContext } from 'react';

export interface UserLayoutContextProps {
  user: Admin.User;
  roles: Rbac.RbacRole[];
  tenants: Tn.TenantUser[];
  selectedTenant?: Tn.TenantUser;
  refreshTenants: () => void;
  switchTenant: (tenantId: string) => void;
  refreshUser: () => void; // 刷新用户
  logout: () => void; // 登出
  unreadCount: number;
  refreshUnreadCount: () => void;
}

export const UserLayoutContext = createContext<UserLayoutContextProps>({} as any);

export default UserLayoutContext;
