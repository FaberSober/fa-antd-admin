import React, {ReactNode, useContext} from 'react';
import {hasPermission} from '@/utils/utils';
import MenuLayoutContext from "@/layout/menu/context/MenuLayoutContext";

interface IProps {
  children: ReactNode;
  permission?: string; // 需要鉴定的权限字符串 TODO 这里修改为必填
}

/**
 * Shiro Permission 包装容器，主要做一下鉴权。
 * 传入需要鉴定的权限字符串，如果用户有该权限，则会展示children组件，如果没有该权限，则不会展示children。
 */
const ShiroPermissionContainer = ({children, permission}: IProps) => {
  const {menuList} = useContext(MenuLayoutContext)

  if (hasPermission(menuList, permission)) {
    return <>{children}</>;
  }
  return null;
};

export default ShiroPermissionContainer;
