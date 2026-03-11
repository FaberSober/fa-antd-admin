import { findIndex } from 'lodash';
import * as FaRouteUtils from '@features/fa-admin-pages/components/utils/FaRouteUtils';
import type { Rbac } from '@/types';
import useRoutesList from './useRoutesList';
import { useMemo } from 'react';

/**
 * 判断当前路径是否有访问权限
 * @author xu.pengfei
 * @date 2023/7/26 17:30
 */
export default function useRoutePermission(menuList: Rbac.RbacMenu[]): [hasPermission: boolean] {
  const routesList = useRoutesList();

  const hasPermission = useMemo(() => {
    const matchRoute = FaRouteUtils.matchRoute(location.pathname, routesList);
    console.log('useRoutePermission', location.pathname, matchRoute)

    const index = findIndex(menuList, (menu) => {
      return menu.linkUrl === location.pathname || menu.linkUrl === matchRoute;
    });

    return index > -1;
  }, [location.pathname, menuList, routesList]);

  return [hasPermission];
}
