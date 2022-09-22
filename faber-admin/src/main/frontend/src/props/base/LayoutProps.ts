import { ReactNode } from 'react';

namespace LayoutProps {
	export enum ThemeStyle {
		light = 'light',
		dark = 'dark',
	}

	export interface Route {
		/** 权限点 */
		permission?: string;
		/** 模块名称ID，对应国际化 */
		name: string;
		path: string;
		icon?: () => ReactNode;
		component?: any;
		/** 子菜单路由 */
		routes?: Route[];
		/** 菜单下挂子页面-但是不展示到SiderMenu侧边菜单中，如人员管理的下挂人员详情页面 */
		nestRoute?: Route[];
	}

	/** 顶部菜单模块 */
	export interface HeaderModalMenu {
		/** 权限点 */
		permission?: string;
		/** 模块名称ID，对应国际化 */
		menu: string;
		/** 模块编码，对应后台菜单Menu的model字段 */
		modal: string;
		/** 点击模块跳转的链接地址 */
		redirect: string;
		/** 是否打开新的窗口 */
		newWindow?: boolean;
		/** 子菜单路由 */
		routes: Route[];
		/** 是否隐藏侧边菜单 */
		hideSider?: boolean;
		icon?: () => ReactNode;
	}

	/** 顶部模块 */
	export interface HeaderModal {
		name: string; // 模块名称
		link: string; // 模块默认跳转链接
		img: string; // 图片
		/** 是否打开新的窗口 */
		newWindow?: boolean;
		hide?: boolean;
		topMenus: HeaderModalMenu[]; // 模块顶部菜单配置
	}

  /** BaseChildProps */
  export interface BaseChildProps {
    children?: ReactNode;
  }
}

export default LayoutProps;
