import React, {useContext, useEffect, useState} from 'react';
import {Menu, MenuProps} from 'antd';
import {Sider} from '@/components/antd-pro';
import {UserMenuContext} from '@/layout/UserMenuLayout';
import {useIntl} from 'react-intl';
import {useLocation} from '@reach/router';
import {pathToRegexp} from 'path-to-regexp';
import {UserContext} from '@/layout/UserSimpleLayout';
import LayoutProps from '@/props/base/LayoutProps';
import {hasPermission} from "@/utils/utils";

/**
 * 匹配点击的路由层级
 * @param pathname
 * @param routes
 */
function matchLocation(pathname: string, routes?: LayoutProps.Route[]): string[] {
  const matches: string[] = [];
  if (routes === undefined) return [];
  for (let i = 0; i < routes?.length; i += 1) {
    const route = routes[i];

    // 使用pathToRegexp判断是否匹配路由
    const matchPath = pathToRegexp(route.path, [], { end: false }).test(pathname);
    // console.log(route.path, matchPath)
    if (matchPath) {
      // matches.push(route.path);
      matches.push(route.name);
    }

    if (route.routes && route.routes[0]) {
      matches.push(...matchLocation(pathname, route.routes));
    }
  }
  return matches;
}

interface Props {
  topMenus?: LayoutProps.HeaderModalMenu; // 模块顶部菜单配置
}

/**
 * 侧边菜单
 */
export default function SiderMenu({ topMenus }: Props) {
  const { user } = useContext(UserContext);
  const { collapse, toggleCollapse, changeCurRoute } = useContext(UserMenuContext);

  const location = useLocation();
  const [clicked, setClicked] = useState(false); // 用户是否点击过菜单，切换过openKeys
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const matches = matchLocation(location.pathname, topMenus?.routes);

  useEffect(() => {
    // 如果用户没有切换过openKeys，设置默认的openKeys
    if (!clicked) {
      setOpenKeys(matches);
    }
  }, [location.pathname, topMenus]);


  const intl = useIntl();

  /**
   * 递归生成菜单Tree
   * @param routes 当前菜单List
   * @param preNameId 上级菜单name的拼接
   */
  function loopProcessRoutes(routes?: LayoutProps.Route[], preNameId: string = 'menu.'): MenuProps['items'] {
    if (routes === undefined || routes === null || routes.length === 0) return undefined;
    return routes
      .filter((route) => hasPermission(user.menus, route.permission))
      .map((route) => ({
        label: intl.formatMessage({ id: `menu.${route.name}` }),
        key: route.name,
        icon: route.icon ? route.icon() : undefined,
        children: loopProcessRoutes(route.routes)
      }))
  }
  const items = loopProcessRoutes(topMenus?.routes)

  function handleOpenKey(newOpenKeys: any[]) {
    setOpenKeys(newOpenKeys);
    setClicked(true);
  }

  return (
    <Sider collapse={collapse} onCollapse={(c) => toggleCollapse(c)}>
      <Menu
        mode="inline"
        theme="dark"
        inlineCollapsed={collapse}
        // defaultSelectedKeys={matches}
        selectedKeys={matches}
        // defaultOpenKeys={openKeys}
        openKeys={openKeys}
        onOpenChange={handleOpenKey}
        style={{ height: '100%', borderRight: 0, marginTop: -4 }}
        items={items}
        onClick={(menu) => changeCurRoute(menu.key)}
      />
    </Sider>
  );
};
