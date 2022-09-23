import React, {createContext, useEffect, useState} from 'react';
import {LayoutProps} from "@/props/base";
import {PageLoading} from "@/components/antd-pro";
import Admin from "@/props/admin";
import userApi from '@/services/admin/user'
import rbacUserRoleApi from '@/services/rbac/rbacUserRole'
import Rbac from "@/props/rbac";
import {clearToken} from "@/utils/cache";
import {useNavigate} from "react-router-dom";

export interface UserLayoutContextProps {
  user: Admin.User,
  roles: Rbac.RbacRole[],
  logout: () => void; // 登出
}

// @ts-ignore
export const UserLayoutContext = createContext<UserLayoutContextProps>({
  user: undefined,
  roles: [],
  logout: () => {},
});

/**
 * 登录后的用户上下文
 * @author xu.pengfei
 * @date 2022/9/21
 */
export default function UserLayout({ children }: LayoutProps.BaseChildProps) {
  const navigate = useNavigate();

  const [user, setUser] = useState<Admin.User>();
  const [roles, setRoles] = useState<Rbac.RbacRole[]>([]);

  useEffect(() => {
    userApi.getLoginUser().then((res) => setUser(res.data))
    rbacUserRoleApi.getMyRoles().then((res) => setRoles(res.data))
  }, [])

  function logout() {
    clearToken();
    navigate('/login');
  }

  if (user === undefined) return <PageLoading />

  const contextValue: UserLayoutContextProps = {
    user,
    roles,
    logout,
  };

  return (
    <UserLayoutContext.Provider value={contextValue}>
      {children}
    </UserLayoutContext.Provider>
  )
}
