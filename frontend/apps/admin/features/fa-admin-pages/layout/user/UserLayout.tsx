import React, { useContext, useEffect, useState } from 'react';
import { Modal } from 'antd';
import type { Admin, Rbac, Tn } from '@/types';
import { clearTnTenantId, clearToken, getTnTenantId, type Fa, PageLoading, setTnTenantId } from '@fa/ui';
import { authApi, msgApi, rbacUserRoleApi, tenantUserApi, userApi } from '@features/fa-admin-pages/services';
import ConfigLayoutContext from '../config/context/ConfigLayoutContext';
import UserLayoutContext, { type UserLayoutContextProps } from './context/UserLayoutContext';

/**
 * 登录后的用户上下文
 * @author xu.pengfei
 * @date 2022/9/21
 */
export default function UserLayout({ children }: Fa.BaseChildProps) {
  const { systemConfig } = useContext(ConfigLayoutContext);
  const [user, setUser] = useState<Admin.User>();
  const [roles, setRoles] = useState<Rbac.RbacRole[]>([]);
  const [tenants, setTenants] = useState<Tn.TenantUser[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<Tn.TenantUser>();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    refreshUser();
    refreshTenants();
    refreshUnreadCount();
    rbacUserRoleApi.getMyRoles().then((res) => setRoles(res.data));
  }, []);

  function refreshUser() {
    userApi.getLoginUser().then((res) => setUser(res.data));
  }

  function refreshTenants() {
    if (!systemConfig.tenantEnabled) {
      clearTnTenantId();
      setTenants([]);
      setSelectedTenant(undefined);
      return;
    }

    tenantUserApi.myTenants().then((res) => {
      const list = res.data || [];
      const cachedTenantId = getTnTenantId();
      const currentTenant = list.find((i) => i.tenantId === cachedTenantId) || list[0];

      setTenants(list);
      setSelectedTenant(currentTenant);
      if (currentTenant) {
        setTnTenantId(currentTenant.tenantId);
      }
    }).catch(() => {
      clearTnTenantId();
      tenantUserApi.myTenants().then((res) => {
        const list = res.data || [];
        const currentTenant = list[0];

        setTenants(list);
        setSelectedTenant(currentTenant);
        if (currentTenant) {
          setTnTenantId(currentTenant.tenantId);
        }
      });
    });
  }

  function switchTenant(tenantId: string) {
    const tenant = tenants.find((i) => i.tenantId === tenantId);
    if (!tenant) return;

    setTnTenantId(tenant.tenantId);
    setSelectedTenant(tenant);
    window.location.reload();
  }

  function logout() {
    Modal.confirm({
      title: '登出',
      content: '确认退出登录？',
      okText: '退出',
      onOk: () =>
        authApi.logout().then((res) => {
          clearToken();
          clearTnTenantId();
          window.location.href = res.data;
        }),
    });
  }

  function refreshUnreadCount() {
    msgApi.countMine().then((res) => setUnreadCount(res.data.unreadCount));
  }

  if (user === undefined) return <PageLoading />;

  const contextValue: UserLayoutContextProps = {
    user,
    roles,
    tenants,
    selectedTenant,
    refreshTenants,
    switchTenant,
    refreshUser,
    logout,
    unreadCount,
    refreshUnreadCount,
  };

  return <UserLayoutContext.Provider value={contextValue}>{children}</UserLayoutContext.Provider>;
}
