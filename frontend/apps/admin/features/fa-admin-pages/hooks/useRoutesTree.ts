import { isNil } from 'lodash';

/**
 * 返回页面菜单的Tree结构
 * @author xu.pengfei
 * @date 2023/7/26 17:09
 */
export default function useRoutesTree() {
  const routes = window.FaRoutes;

  function loop(rs: any[]): any[] | undefined {
    if (isNil(rs) || rs.length === 0) return undefined;

    return rs
      .filter((r) => r.path !== '*' && r.path !== '' && r.path !== '/')
      .map((r) => {
        return {
          value: r.path,
          label: r.path,
          children: loop(r.children),
        };
      });
  }
  const routeTree = loop(routes);
  return routeTree;
}
