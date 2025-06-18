import { findIndex } from 'lodash';
import * as FaRouteUtils from '@features/fa-admin-pages/components/utils/FaRouteUtils';
import type { Rbac } from '@/types';
import useRoutesList from './useRoutesList';

/**
 * 判断当前路径是否有访问权限
 * @author xu.pengfei
 * @date 2023/7/26 17:30
 */
export default function useRoutePermission(menuList: Rbac.RbacMenu[]): [hasPermission: boolean] {
  const routesList = useRoutesList();
  // console.log('useRouteMatch', location, routesList)

  const matchRoute = FaRouteUtils.matchRoute(location.pathname, routesList);
  // console.log('useRouteMatch', location, matchRoute)

  const index = findIndex(menuList, (menu) => {
    return menu.linkUrl === matchRoute;
  });

  const hasPermission = index > -1;

  return [hasPermission];
}
