import { createContext } from 'react';
import { Fa, Rbac } from '@/types';

export interface MenuLayoutContextProps {
  menuList: Rbac.RbacMenu[]; // 当前展示的菜单树
  menuFullTree: Fa.TreeNode<Rbac.RbacMenu>[]; // 完整的菜单树
  menuTree: Fa.TreeNode<Rbac.RbacMenu>[];
  menuSelAppId: string | undefined; // 选中的菜单模块id
  menuSelPath: string[]; // 选中的菜单路径
  menuSelMenuId: string | undefined; // 选中打开的菜单id,
  setMenuSelMenuId: (key: string | undefined) => void; // 设置选中的菜单ID
  setMenuSelPath: (key: string, keyPath: string[]) => void; //  // 设置选中的菜单ID路径数组
  setMenuSelAppId: (id: string) => void;
  collapse: boolean | undefined;
  setCollapse: (v: boolean) => void;
  openSideMenuKeys: string[];
  setOpenSideMenuKeys: (v: string[]) => void;
  openTabs: Rbac.RbacMenu[]; // 打开的菜单历史记录
  setOpenTabs: (v: Rbac.RbacMenu[]) => void;
}

const MenuLayoutContext = createContext<MenuLayoutContextProps>({
  menuList: [],
  menuFullTree: [],
  menuTree: [],
  menuSelAppId: undefined,
  menuSelMenuId: undefined,
  setMenuSelMenuId: () => {},
  menuSelPath: [],
  setMenuSelPath: () => {},
  setMenuSelAppId: () => {},
  collapse: false,
  setCollapse: () => {},
  openSideMenuKeys: [],
  setOpenSideMenuKeys: () => {},
  openTabs: [],
  setOpenTabs: () => {},
});

export default MenuLayoutContext;
