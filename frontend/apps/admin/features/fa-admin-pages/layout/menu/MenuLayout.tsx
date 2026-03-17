import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Empty } from 'antd';
import { find, isNil } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useLocalStorage } from 'react-use';
import { type Fa, FaEnums, FaFlexRestLayout, FaUiContext, type FaUiContextProps, findTreePath, flatTreeList } from '@fa/ui';
import { HelpCube, Logo, MenuAppHorizontal, MsgBadgeCube, OpenTabs, SideMenu, UserAvatar, WxMiniApp } from './cube';
import type { Rbac } from '@/types';
import { rbacUserRoleApi } from '@features/fa-admin-pages/services';
import useRoutePermission from '../../hooks/useRoutePermission';
import MenuLayoutContext, { type MenuLayoutContextProps, type OpenTabsItem } from './context/MenuLayoutContext';
import { ConfigLayoutContext } from '../config/context/ConfigLayoutContext';
import UserLayoutContext from '../user/context/UserLayoutContext';
import './MenuLayout.scss';
import { SITE_INFO } from '@/configs';
import MenuCollapse from './cube/MenuCollapse';
import MenuRefresh from './cube/MenuRefresh';
import MenuSearch from './cube/MenuSearch';
import FullScreenToggle from './cube/FullScreenToggle';
import ThemeToggle from './cube/ThemeToggle';


export interface MenuLayoutProps extends Fa.BaseChildProps {
  renderHeaderExtra?: () => React.ReactNode;
}

/**
 * 厂字形菜单布局
 * @author xu.pengfei
 * @date 2022/9/22 22:23
 */
export default function MenuLayout({ renderHeaderExtra, children }: MenuLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { systemConfig } = useContext(ConfigLayoutContext);
  const { user } = useContext(UserLayoutContext);

  // 以用户id为维度的 localStorage key，保证多账户隔离
  const openTabsCacheKey = useMemo(() => `fa-open-tabs-${user?.id || 'guest'}`, [user?.id]);

  // 将tree平铺的menu list
  const [menuList, setMenuList] = useState<Rbac.RbacMenu[]>([]);
  // 完整的menu tree
  const [menuFullTree, setMenuFullTree] = useState<Fa.TreeNode<Rbac.RbacMenu>[]>([]);
  // 当前选中block下的menu tree
  const [menuTree, setMenuTree] = useState<Fa.TreeNode<Rbac.RbacMenu>[]>([]);

  const [menuSelAppId, setMenuSelAppId] = useState<string>(); // 当前选中顶部模块blockId
  const [menuSelMenuId, setMenuSelMenuId] = useState<string>(); // 当前选中的左侧菜单menu id
  const [menuSelPath, setMenuSelPath] = useState<string[]>([]); // 当前选中的菜单ID数组（不包含顶部block菜单）
  const [collapse, setCollapse] = useLocalStorage<boolean>('MenuLayout.collapse', false); // 是否折叠左侧菜单
  const [showTabs, setShowTabs] = useLocalStorage<boolean>('MenuLayout.showTabs', SITE_INFO.SHOW_TABS || true); // 是否展示标签栏
  const [menuContentFull, setMenuContentFull] = useLocalStorage<boolean>('MenuLayout.menuContentFull', false); // 是否网页内全屏
  const [openSideMenuKeys, setOpenSideMenuKeys] = useState<string[]>([]); // 受控-左侧菜单打开的menu id数组
  const [openTabs, setOpenTabs] = useLocalStorage<OpenTabsItem[]>(openTabsCacheKey, []); // 受控-打开的标签页数组（localStorage缓存，按用户id隔离）
  const [curTab, setCurTab] = useState<OpenTabsItem>(); // 受控-当前选中的tab
  const [tabReloadKeys, setTabReloadKeys] = useState<Record<string, number>>({}); // 每个tab的reload版本号

  const [breadcrumbs, setBreadcrumbs] = useState<{title:string}[]>([])


  const [hasPermission] = useRoutePermission(menuList);

  const [faTabCache, setFaTabCache] = useLocalStorage<any>('fa-tab-cache', {});

  useEffect(() => {
    rbacUserRoleApi.getMyMenusTree().then((res) => {
      setMenuFullTree(res.data);
      const menuArr = flatTreeList(res.data);
      setMenuList(menuArr);

      // 初始化选中的菜单
      const menu = find(menuArr, (i) => i.linkUrl === location.pathname) as Rbac.RbacMenu;
      if (menu) {
        // 找到菜单
        syncOpenMenuById(menu.id, res.data);
      } else {
        // 未找到菜单，解析打开的菜单
        try {
          // console.log('faTabCache', faTabCache)
          const cacheTabItem = faTabCache[location.pathname];
          if (!isNil(cacheTabItem)) {
            const itemFind = find(openTabs || [], (i) => i.key === cacheTabItem.key);
            if (isNil(itemFind)) {
              setOpenTabs([...(openTabs || []), cacheTabItem]);
            }
            setCurTab(cacheTabItem);
            navigateTab(cacheTabItem);
            // justSyncOpenMenuById(cacheTabItem.linkMenuId, res.data);
          }
        } catch (e) {
          /* empty */
        }
      }
    });
  }, []);


  function transMenuToTabItem(menu: Rbac.RbacMenu): OpenTabsItem {
    return {
      key: menu.id,
      path: menu.linkUrl,
      name: menu.name,
      icon: menu.icon,
      closeable: true,
    };
  }

  /**
   * 同步打开的菜单到页面布局
   * @param openMenuId
   * @param tree
   */
  function syncOpenMenuById(openMenuId: string | undefined, tree: Fa.TreeNode<Rbac.RbacMenu>[]) {
    // console.log('syncOpenMenuById', curTab)
    if (openMenuId === undefined) return;

    const menuArr = flatTreeList(tree);
    const menu = find(menuArr, (i) => i.id === openMenuId) as Rbac.RbacMenu;
    if (menu === undefined) {
      // 未找到对应的菜单，说明不是菜单页，是新开的自定义tab，无需同步菜单
      const tabItem = find(openTabs || [], (i) => i.key === openMenuId);
      setCurTab(tabItem);
      if (tabItem) {
        navigateTab(tabItem);
      }
      setMenuSelPath([]);
      return;
    }

    // 设置选中的menuId，
    setMenuSelMenuId(openMenuId);
    // 打开页面
    navigate(menu.linkUrl);

    const menuPath = findTreePath(tree, (menu) => menu.sourceData.id === openMenuId);
    const [id0, ...restIds] = menuPath;

    // 顶部模块同步打开位置
    const blocks = tree.filter((i) => i.sourceData.level === FaEnums.RbacMenuLevelEnum.APP);
    const blockFind = find(blocks, (i) => i.id === id0.id);
    if (blockFind) {
      setMenuSelAppId(blockFind.id);
      setMenuTree(blockFind.children || []);
    } else {
      setMenuTree([]);
    }

    // sider同步打开位置
    const menuIds = restIds.map((i) => i.id);
    setMenuSelPath(menuIds);
    console.log(menuPath);
    setBreadcrumbs(menuPath.map(m=>({title:m.name})))

    setOpenSideMenuKeys(collapse ? [] : menuIds);

    // 加入已经打开的tabs
    const tab = find(openTabs || [], (i) => i.key === menu.id);
    if (isNil(tab)) {
      const tabItem = transMenuToTabItem(menu);
      setOpenTabs([...(openTabs || []), tabItem]);
      setCurTab(tabItem);
    } else {
      setCurTab(tab);
    }
  }

  function navigateTab(tabItem: OpenTabsItem | undefined) {
    if (tabItem === undefined) return;
    if (tabItem.type === 'iframe') {
      window.FaIframeUrl = tabItem.path;
      navigate(`/admin/iframe`);
    } else {
      navigate(tabItem.path);
    }
  }

  const contextValue: MenuLayoutContextProps = {
    menuFullTree,
    menuList,
    menuTree,
    menuSelAppId,
    menuSelPath,
    menuSelMenuId,
    setMenuSelMenuId: (id) => {
      // console.log('setMenuSelMenuId')
      syncOpenMenuById(id, menuFullTree);
    },
    setMenuSelPath: (key: string) => {
      syncOpenMenuById(key, menuFullTree);
    },
    setMenuSelAppId: (id) => {
      setMenuSelAppId(id);
      const selTree = find(menuFullTree, (i) => i.sourceData.id === id);
      setMenuTree(selTree && selTree.children ? selTree.children : []);
      setMenuSelPath([]);
    },
    collapse,
    setCollapse: setCollapse,
    openSideMenuKeys,
    setOpenSideMenuKeys,
    showTabs,
    setShowTabs,
    menuContentFull,
    setMenuContentFull,
    openTabs: openTabs || [],
    curTab,
    setCurTab: (tab: OpenTabsItem | undefined) => {
      // console.log('setCurTab')
      syncOpenMenuById(tab?.key, menuFullTree);
    },
    setOpenTabs,
    addTab: (tab1: OpenTabsItem) => {
      const newTab: OpenTabsItem = { ...tab1, linkMenuId: menuSelMenuId };
      const tabFind = find(openTabs || [], (i) => i.key === newTab.key); // 查找已打开的tab
      if (tabFind) {
        syncOpenMenuById(tabFind.key, menuFullTree);
      } else {
        // 使用函数式更新避免 stale closure 捕获旧 openTabs
        setOpenTabs((prev) => [...(prev || []), newTab]);
        setCurTab(newTab);
        navigateTab(newTab);
        syncOpenMenuById(newTab.key, menuFullTree);
      }
      // cache tab info
      setFaTabCache({ ...faTabCache, [newTab.path]: newTab });
    },
    removeTab: (tabKey: string) => {
      // console.log('close tab', tabKey)
      setOpenTabs((openTabs || []).filter((i) => i.key !== tabKey));
    },
    selTab: (tabKey: string) => {
      // console.log('selTab')
      syncOpenMenuById(tabKey, menuFullTree);
    },
    reloadKey: tabReloadKeys[curTab?.key ?? ''] ?? 0,
    reloadTab: (tabKey: string) => {
      setTabReloadKeys((prev) => ({
        ...prev,
        [tabKey]: (prev[tabKey] ?? 0) + 1,
      }));
    },
  };

  const faUiContextValue: FaUiContextProps = {
    permissions: menuList.map((m) => m.linkUrl),
  };

  const width = collapse ? 'calc(100% - 44px)' : 'calc(100% - 200px)';
  return (
    <MenuLayoutContext.Provider value={contextValue}>
      <FaUiContext.Provider value={faUiContextValue}>
        <div style={{ height: '100vh', width: '100vw' }} className="fa-full fa-flex-column">
          <Helmet title={`${curTab ? curTab.name + ' | ' : ''}${systemConfig.title}`} />

          <div className="fa-menu-header fa-border-b" style={{ display: menuContentFull ? 'none' : undefined }}>
            <Logo />
            <div className='fa-flex-row fa-gap6'>
              <MenuCollapse />
              <MenuRefresh />
            </div>
            <div style={{ flex: 1, marginLeft: 6 }}>
              <MenuAppHorizontal />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <MenuSearch />
              {renderHeaderExtra && renderHeaderExtra()}
              {/*<LangToggle />*/}
              <WxMiniApp />
              <HelpCube />
              <ThemeToggle />
              <FullScreenToggle />
              <MsgBadgeCube />
              <UserAvatar />
            </div>
          </div>

          <FaFlexRestLayout style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ display: menuContentFull ? 'none' : undefined, height: '100%' }}>
              <SideMenu />
            </div>

            <FaFlexRestLayout >
              <div className="fa-full fa-flex-column fa-relative">
                {showTabs && <OpenTabs />}
                <FaFlexRestLayout>
                  <div className="fa-full fa-main">{hasPermission ? <React.Fragment key={tabReloadKeys[curTab?.key ?? ''] ?? 0}>{children}</React.Fragment> : <Empty description="页面丢失了" />}</div>
                </FaFlexRestLayout>
              </div>
            </FaFlexRestLayout>
          </FaFlexRestLayout>
        </div>
      </FaUiContext.Provider>
    </MenuLayoutContext.Provider>
  );
}
