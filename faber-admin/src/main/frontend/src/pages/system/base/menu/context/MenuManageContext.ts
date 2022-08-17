import { createContext } from 'react';
import Admin from '@/props/admin';

export interface MenuManageContextProps {
	viewBlock: Admin.MenuBlock | undefined; // 当前访问的模块
	changeViewBlock: (v: Admin.MenuBlock | undefined) => void;
	viewMenu: Admin.Menu | undefined; // 当前访问的菜单
	changeViewMenu: (v: Admin.Menu | undefined) => void;
}

const MenuManageContext = createContext<MenuManageContextProps>({
	// @ts-ignore
	viewBlock: undefined,
	changeViewBlock: () => {},
	// @ts-ignore
	viewMenu: undefined,
	changeViewMenu: () => {},
});

export default MenuManageContext;
