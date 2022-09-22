import React, {createContext, useEffect, useState} from 'react';
import useBus from "use-bus";
import {LayoutProps} from "@/props/base";
import {PageLoading} from "@/components/antd-pro";
import Admin from "@/props/admin";
import userApi from '@/services/admin/user'

export interface UserLayoutContextProps {
  user: Admin.User,
}

export const UserLayoutContext = createContext<UserLayoutContextProps>({
  // @ts-ignore
  user: undefined,
});

/**
 * @author xu.pengfei
 * @date 2022/9/21
 */
export default function UserLayout({ children }: LayoutProps.BaseChildProps) {
  const [user, setUser] = useState<Admin.User>();

  useEffect(() => {
    userApi.getLoginUser().then((res) => setUser(res.data))
  }, [])

  if (user === undefined) return <PageLoading />

  const contextValue: UserLayoutContextProps = {
    user,
  };

  return (
    <UserLayoutContext.Provider value={contextValue}>
      {children}
    </UserLayoutContext.Provider>
  )
}
