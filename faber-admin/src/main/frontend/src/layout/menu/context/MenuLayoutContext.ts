import { createContext } from 'react';
import FaberBase from "@/props/base/FaberBase";
import Rbac from "@/props/rbac";


export interface MenuLayoutContextProps {
  menuList: Rbac.RbacMenu[], // 当前展示的菜单树
  menuFullTree: FaberBase.TreeNode<Rbac.RbacMenu>[], // 完整的菜单树
  menuTree: FaberBase.TreeNode<Rbac.RbacMenu>[],
  menuSelAppId: string | undefined, // 选中的菜单模块id
  menuSelPath: FaberBase.TreeNode<Rbac.RbacMenu>[], // 选中的菜单路径
  setMenuSelAppId: (id: string) => void,
  collapse: boolean,
  setCollapse: (v: boolean) => void,
}

const MenuLayoutContext = createContext<MenuLayoutContextProps>({
  menuList: [],
  menuFullTree: [],
  menuTree: [],
  menuSelAppId: undefined,
  menuSelPath: [],
  setMenuSelAppId: () => {},
  collapse: false,
  setCollapse: () => {},
});

export default MenuLayoutContext;
