import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {Link, navigate, RouteComponentProps, useLocation} from '@reach/router';
import {each, find} from 'lodash';
import {Empty, Layout} from 'antd';
import {pathToRegexp} from 'path-to-regexp';
import {FormattedMessage, useIntl} from 'react-intl';
import {Helmet} from 'react-helmet-async';
import LayoutProps from '@/props/base/LayoutProps';
import {UserContext} from './UserSimpleLayout';
import { useLocalStorageState } from 'ahooks'

import UserAvatar from '@/layout/cube/UserAvatar';
import TopModalMenu from '@/layout/cube/TopModalMenu';
import ModalSelect from '@/layout/cube/ModalSelect';
import SiderMenu from '@/layout/cube/SiderMenu';

import styles from './styles/UserMenuLayout.module.less';
import {hasPermission} from "@/utils/utils";
import MsgBadgeCube from "@/layout/cube/MsgBadgeCube";
import HelpCube from "@/layout/cube/HelpCube";
import LangToggle from "@/layout/cube/LangToggle";

const defaultRoute: LayoutProps.Route = {
  name: '',
  path: '',
};

interface CProps {
  // -------------------- 布局-顶部菜单 --------------------
  curTopMenu?: string; // 当前选中的顶部模块的menu字段
  changeCurTopMenu: (menu: string) => void; // 变更顶级菜单模块
  // -------------------- 布局-侧边菜单 --------------------
  collapse: boolean; // 侧边菜单是否折叠
  toggleCollapse: (v: boolean) => void;
  curRoute: LayoutProps.Route; // 当前选中的菜单路由
  changeCurRoute: (menuName: string) => void;
}

export const UserMenuContext = createContext<CProps>({
  collapse: false,
  toggleCollapse: () => {},
  changeCurTopMenu: () => {},
  curRoute: defaultRoute,
  changeCurRoute: () => {},
});

interface FlatRoute extends LayoutProps.Route {
  topMenu: string; // 平铺后每个路由对应的顶部菜单
  isLeaf: boolean; // 是否是叶子节点
  name: string; // 路由的名称
  path: string; // 路由path
}

interface IProps extends RouteComponentProps {
  children?: ReactNode | Element;
  /** 顶部菜单模块配置 */
  headerModal: LayoutProps.HeaderModal;
}

function UserMenuLayout({ children, headerModal }: IProps) {
  const location = useLocation();
  // console.log('pathToRegexp', pathToRegexp('/pig/device/earring/:deviceId', [], { end: true }).test('/pig/device/earring/1111'))

  const { user, systemConfig } = useContext(UserContext);

  // context properties
  const [collapse, setCollapse] = useLocalStorageState<string>('sider.collapse', { defaultValue: '1' });
  const [curTopMenu, setCurTopMenu] = useState(headerModal.topMenus[0].menu);
  const [curRoute, setCurRoute] = useState<LayoutProps.Route>(defaultRoute);
  // inner properties
  const [flatRoutes, setFlatRoutes] = useState<FlatRoute[]>([]);

  useEffect(() => {
    // console.log('将Tree路由平铺')
    const authTopMenus = headerModal.topMenus.filter((tm) => hasPermission(user.menus, tm.permission));
    // console.log('authTopMenus', authTopMenus)
    const fr: FlatRoute[] = [];
    for (let i = 0; i < authTopMenus.length; i += 1) {
      fr.push(...flatRouteList(authTopMenus[i].routes, authTopMenus[i].menu));
    }
    console.log('flatRoutes', fr)
    setFlatRoutes(fr);

    // console.log('初始化解析路由')
    each(fr, (route) => {
      if (pathToRegexp(route.path).test(location.pathname)) {
        // console.log('初始化解析路由', route)
        setCurRoute(route);
        setCurTopMenu(route.topMenu);
      }
    });
  }, [headerModal, user]);

  /**
   * 将Tree路由平铺
   * @param routesList
   * @param topMenu 顶部菜单的模块名称
   */
  function  flatRouteList(routesList: LayoutProps.Route[], topMenu: string): FlatRoute[] {
    const frList = [];
    for (let i = 0; i < routesList.length; i += 1) {
      const { routes, nestRoute, ...rest } = routesList[i];
      // 这里可以加权限校验
      if (hasPermission(user.menus, rest.permission)) {
        const isLeaf = routes === undefined || routes.length === 0;
        frList.push({ ...rest, topMenu, isLeaf });
        // 下挂菜单路由
        if (routes && routes[0]) {
          frList.push(...flatRouteList(routes, topMenu));
        }
        // 下挂子路由
        if (nestRoute && nestRoute[0]) {
          frList.push(...flatRouteList(nestRoute, topMenu));
        }
      }
    }
    return frList;
  }

  /**
   * 根据路由完全匹配解析标题(带国际化)
   * 1. 考虑是否将findJustRoutes完全匹配的路由放入Context中
   */
  function parseTitle(): string {
    const intl = useIntl();
    // let title = intl.formatMessage({ id: 'site.title' });
    let title = systemConfig.title;

    // 查找完全匹配的路由
    const findJustRoutes = find(flatRoutes, (route) => pathToRegexp(route.path).test(location.pathname));
    if (findJustRoutes && findJustRoutes.name !== '') {
      title = `${intl.formatMessage({ id: `menu.${curRoute.name}` })} - ${title}`;
    }
    return title;
  }

  const contextValue: CProps = {
    collapse: collapse === '1',
    toggleCollapse: (v) => setCollapse(v ? '1' : '0'),
    curTopMenu,
    changeCurTopMenu: (v) => {
      // 判断是否跳转新窗口
      const curHeaderMenu = find(headerModal.topMenus, (i) => i.menu === v);
      if (curHeaderMenu && curHeaderMenu.newWindow) {
        window.open(curHeaderMenu.redirect, '_blank');
        return;
      }

      setCurTopMenu(v); // 设置顶部菜单

      // 设置当前路由
      const findRoutes = flatRoutes.filter((i) => i.topMenu === v && i.isLeaf && i.path && hasPermission(user.menus, i.permission));
      if (findRoutes && findRoutes[0]) {
        setCurRoute(findRoutes[0]);
        navigate(findRoutes[0].path);
      }
    },
    curRoute,
    changeCurRoute: (menuName) => {
      const findRoutes = flatRoutes.filter((i) => i.name === menuName && i.isLeaf && i.path && hasPermission(user.menus, i.permission));
      if (findRoutes && findRoutes[0]) {
        setCurRoute(findRoutes[0]);
        navigate(findRoutes[0].path);
      }
    },
  };

  // 进行权限判断
  // const hasRoutePermission = true;
  const hasRoutePermission = hasPermission(user!.menus, curRoute ? curRoute.permission : undefined);
  // console.log('hasRoutePermission', hasRoutePermission, 'curRoute', curRoute)

  const curHeaderMenu = find(headerModal.topMenus, (i) => i.menu === curTopMenu);
  const hideSider = curHeaderMenu && curHeaderMenu.hideSider; // 是否隐藏侧边菜单

  // 计算宽度
  let width = '100%';
  if (!hideSider) {
    width = collapse === '1' ? 'calc(100% - 44px)' : 'calc(100% - 200px)';
  }
  return (
    <UserMenuContext.Provider value={contextValue}>
      <Layout style={{ height: '100vh', width: '100vw' }}>
        <Helmet title={parseTitle()} />

        <Layout.Header className={styles.header}>
          <Link to="/" className={styles.logo}>
            <img src={systemConfig.logo} alt="logo" className={styles.logoImg} />
            <span className={styles.logoTitle}>
              {systemConfig.title}
              {/*<FormattedMessage id="site.title" />*/}
            </span>
          </Link>
          <TopModalMenu headerModal={headerModal} />
          <ModalSelect headerModal={headerModal} />
          <LangToggle />
          <MsgBadgeCube />
          <HelpCube />
          <UserAvatar />
        </Layout.Header>

        <Layout style={{ flexDirection: 'row' }}>
          {!hideSider && <SiderMenu topMenus={curHeaderMenu} />}
          <Layout style={{ width }}>
            {hasRoutePermission ? (
              <>
                {/* TODO 路由展示 */}
                <div style={{ padding: 8, margin: 0, overflowX: 'hidden', overflowY: 'auto', position: 'relative', height: '100%' }}>
                  {children}
                </div>
              </>
            ) : (
              <Empty description={<FormattedMessage id="app.exception.description.403" />} />
            )}
          </Layout>
        </Layout>
      </Layout>
    </UserMenuContext.Provider>
  );
}

export default UserMenuLayout;
