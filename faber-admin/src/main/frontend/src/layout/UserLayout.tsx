import React, {createContext, useEffect, useState} from 'react';
import {Fa} from "@/props/base";
import {PageLoading} from "@/components/antd-pro";
import Admin from "@/props/admin";
import userApi from '@/services/admin/user'
import rbacUserRoleApi from '@/services/rbac/rbacUserRole'
import Rbac from "@/props/rbac";
import {clearToken} from "@/utils/cache";
import {useNavigate} from "react-router-dom";
import dictApi from "@/services/admin/dict";
import msgApi from "@/services/admin/msg";

export interface UserLayoutContextProps {
  user: Admin.User,
  roles: Rbac.RbacRole[],
  refreshUser: () => void, // 刷新用户
  logout: () => void, // 登出
  systemConfig: Admin.SystemConfigPo,
  unreadCount: number,
  refreshUnreadCount: () => void,
}

const defaultConfig:Admin.SystemConfigPo = { title: '', subTitle: '', logo: '', logoWithText: '', portalLink: '', phpRedisAdmin: '' }

export const UserLayoutContext = createContext<UserLayoutContextProps>({
  user: undefined!,
  roles: [],
  refreshUser: () => {},
  logout: () => {},
  systemConfig: defaultConfig,
  unreadCount: 0,
  refreshUnreadCount: () => {},
});

/**
 * 登录后的用户上下文
 * @author xu.pengfei
 * @date 2022/9/21
 */
export default function UserLayout({ children }: Fa.BaseChildProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<Admin.User>();
  const [roles, setRoles] = useState<Rbac.RbacRole[]>([]);
  const [systemConfig, setSystemConfig] = useState<Admin.SystemConfigPo>(defaultConfig);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    refreshUser()
    rbacUserRoleApi.getMyRoles().then((res) => setRoles(res.data))
    // 获取系统配置参数
    dictApi.getSystemConfig().then((res) => setSystemConfig(res.data))
  }, [])

  function refreshUser() {
    userApi.getLoginUser().then((res) => setUser(res.data))
  }

  function logout() {
    clearToken();
    navigate('/login');
  }

  function refreshUnreadCount() {
    msgApi.countMine().then(res => setUnreadCount(res.data.unreadCount))
  }

  if (user === undefined) return <PageLoading />

  const contextValue: UserLayoutContextProps = {
    user,
    roles,
    refreshUser,
    logout,
    systemConfig,
    unreadCount,
    refreshUnreadCount,
  };

  return (
    <UserLayoutContext.Provider value={contextValue}>
      {children}
    </UserLayoutContext.Provider>
  )
}
