import type React from 'react';
import { createContext, type ReactNode } from 'react';
import type { Fa, Rbac } from '@/types';

export interface OpenTabsItem {
  key: string; // 唯一key
  path: string; // 页面URL
  name: string; // 名称
  type?: 'iframe' | 'inner'; // 打开页面类型，默认为inner
  closeable?: boolean; // 是否可以关闭
  icon?: string | ReactNode; // 图标标识
  linkMenuId?: string; // 对应需要打开的菜单ID
  linkCurrentMenu?: boolean; // TODO 打开tab时是否关联当前菜单，默认设置为true，功能需要开发
}

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
  showTabs: boolean | undefined; // 是否展示标签栏
  setShowTabs: (v: boolean) => void; // 改变展示标签栏
  openTabs: OpenTabsItem[]; // 打开的菜单历史记录
  curTab: OpenTabsItem | undefined; // 当前选中的tab
  setCurTab: (v: OpenTabsItem | undefined) => void;
  setOpenTabs: (v: OpenTabsItem[]) => void;
  addTab: (tab: OpenTabsItem) => void; // 添加新的tab
  removeTab: (key: string) => void; // 添加新的tab
  selTab: (key: string) => void; // 选中tab
}

const MenuLayoutContext: React.Context<MenuLayoutContextProps> = createContext<MenuLayoutContextProps>({
  menuList: [],
  menuFullTree: [],
  menuTree: [],
  menuSelAppId: undefined,
  menuSelPath: [],
  menuSelMenuId: undefined,
  setMenuSelMenuId: () => {},
  setMenuSelPath: () => {},
  setMenuSelAppId: () => {},
  collapse: false,
  setCollapse: () => {},
  openSideMenuKeys: [],
  setOpenSideMenuKeys: () => {},
  showTabs: true,
  setShowTabs: () => {},
  openTabs: [],
  curTab: undefined,
  setCurTab: () => {},
  setOpenTabs: () => {},
  addTab: () => {},
  removeTab: () => {},
  selTab: () => {},
});

export default MenuLayoutContext;
