import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Menu } from 'antd';
import { Sider } from '@/components/antd-pro';
import { UserMenuContext } from '@/layout/UserMenuLayout';
import { FormattedMessage } from 'react-intl';
import { useLocation } from '@reach/router';
import { pathToRegexp } from 'path-to-regexp';
import { UserContext } from '@/layout/UserSimpleLayout';
import LayoutProps from '@/props/base/LayoutProps';
import {hasPermission} from "@/utils/utils";

const { SubMenu } = Menu;

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
      matches.push(route.path);
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

  /**
   * 递归生成菜单Tree
   * @param routes 当前菜单List
   * @param preNameId 上级菜单name的拼接
   */
  function loopRoutes(routes?: LayoutProps.Route[], preNameId: string = 'menu.') {
    return routes
      ?.filter((route) => hasPermission(user.menus, route.permission))
      ?.map((route) => {
        if (route.routes && route.routes[0]) {
          return (
            <SubMenu key={route.path} icon={route.icon ? route.icon() : undefined} title={<FormattedMessage id={`menu.${route.name}`} />}>
              {loopRoutes(route.routes, `menu.${route.name}.`)}
            </SubMenu>
          );
        }
        return (
          <Menu.Item key={route.path} icon={route.icon ? route.icon() : undefined} onClick={() => changeCurRoute(route)}>
            <FormattedMessage id={`menu.${route.name}`} />
          </Menu.Item>
        );
      });
  }

  function handleOpenKey(newOpenKeys: any[]) {
    setOpenKeys(newOpenKeys);
    setClicked(true);
  }

  const menus = useMemo(() => loopRoutes(topMenus?.routes), [topMenus?.menu, user.id]);

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
      >
        {menus}
      </Menu>
    </Sider>
  );
};
