import React, { useEffect, useState } from 'react';
import { Modal } from 'antd';
import type { Admin, Rbac } from '@/types';
import { clearToken, type Fa, LoginMode, PageLoading, setLoginMode, setToken, useQs } from '@fa/ui';
import { authApi, msgApi, rbacUserRoleApi, userApi } from '@features/fa-admin-pages/services';
import UserLayoutContext, { type UserLayoutContextProps } from './context/UserLayoutContext';


/**
 * 使用token登录后的用户上下文，页面URL形如：http://xxx?token=123
 * 通过解析上下文token
 * @author xu.pengfei
 * @date 2026-01-16 15:58:46
 */
export default function UserTokenLayout({ children }: Fa.BaseChildProps) {
  const [user, setUser] = useState<Admin.User>();
  const [roles, setRoles] = useState<Rbac.RbacRole[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const search = useQs();

  useEffect(() => {
    console.log('search', search)
    authApi.loginByToken(search.token as string).then(res => {
      setToken(res.data.tokenValue);
      setLoginMode(LoginMode.LOCAL);
      refreshUser()
    })
  }, [search.token]);

  function refreshUser() {
    userApi.getLoginUser().then((res) => setUser(res.data));
  }

  function logout() {
    Modal.confirm({
      title: '登出',
      content: '确认退出登录？',
      okText: '退出',
      onOk: () =>
        authApi.logout().then((res) => {
          clearToken();
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
    refreshUser,
    logout,
    unreadCount,
    refreshUnreadCount,
  };

  return <UserLayoutContext.Provider value={contextValue}>{children}</UserLayoutContext.Provider>;
}
