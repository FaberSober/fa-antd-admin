import { isNil } from 'lodash';
import { useMemo } from 'react';

const routes = window.FaRoutes;

/**
 * 返回页面菜单的List结构
 * @author xu.pengfei
 * @date 2023/7/26 17:09
 */
export default function useRoutesList(): string[] {
  const list: string[] = useMemo(() => {
    const routePathList: string[] = [];
    function loop(parentPath: string, rs: any[]) {
      if (isNil(rs) || rs.length === 0) return;
      return rs
        .filter((r) => r.path !== '*' && r.path !== '' && r.path !== '/')
        .map((r) => {
          const curPath = parentPath + '/' + r.path;
          routePathList.push(curPath);
          loop(curPath, r.children);
        });
    }
    loop('', routes);
    return routePathList;
  }, [routes]);

  return list;
}
