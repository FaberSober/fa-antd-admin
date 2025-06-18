/**
 * 匹配路径，如：/admin/blog/123，匹配成功后返回：/admin/blog/:id
 * @param pathname 如：/admin/blog/123
 * @param routeList 全部的路径List
 */
export function matchRoute(pathname: string, routeList: string[]) {
  for (let i = 0; i < routeList.length; i += 1) {
    const route = routeList[i];
    if (pathname === route) {
      return route;
    }
    // 如果包含:id格式
    if (route.indexOf(':') > -1) {
      const routePre = route.substring(0, route.indexOf(':'));
      const matchId = pathname.replace(routePre, '');
      // 如果匹配后的 matchId 不包含 / ，则判定为匹配成功
      if (matchId.indexOf('/') === -1) {
        return route;
      }
    }
  }
  return undefined;
}
