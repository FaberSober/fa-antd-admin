import React, { useContext, useEffect, useState } from 'react';
import { Empty, Layout } from 'antd';
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
import './MenuLayout.scss';
import { SITE_INFO } from '@/configs';

/**
 * 厂字形菜单布局
 * @author xu.pengfei
 * @date 2022/9/22 22:23
 */
export default function MenuLayout({ children }: Fa.BaseChildProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { systemConfig } = useContext(ConfigLayoutContext);

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
  const [openSideMenuKeys, setOpenSideMenuKeys] = useState<string[]>([]); // 受控-左侧菜单打开的menu id数组
  const [openTabs, setOpenTabs] = useState<OpenTabsItem[]>([]); // 受控-打开的标签页数组
  const [curTab, setCurTab] = useState<OpenTabsItem>(); // 受控-当前选中的tab

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
            const itemFind = find(openTabs, (i) => i.key === cacheTabItem.key);
            if (isNil(itemFind)) {
              setOpenTabs([...openTabs, cacheTabItem]);
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

  useEffect(() => {
    // syncOpenMenuById(menuSelMenuId, menuFullTree);
  }, [collapse]);

  function transMenuToTabItem(menu: Rbac.RbacMenu): OpenTabsItem {
    return {
      key: menu.id,
      path: menu.linkUrl,
      name: menu.name,
      closeable: true,
    };
  }

  // function justSyncOpenMenuById(openMenuId: string | undefined, tree: Fa.TreeNode<Rbac.RbacMenu>[]) {
  //   if (openMenuId === undefined) return;
  //
  //   const menuArr = flatTreeList(tree);
  //   const menu = find(menuArr, (i) => i.id === openMenuId) as Rbac.RbacMenu;
  //   if (menu === undefined) return;
  //
  //   // 设置选中的menuId，
  //   setMenuSelMenuId(openMenuId);
  //   const menuPath = findTreePath(tree, (menu) => menu.sourceData.id === openMenuId);
  //   const [id0, ...restIds] = menuPath;
  //
  //   // 顶部模块同步打开位置
  //   const blocks = tree.filter((i) => i.sourceData.level === FaEnums.RbacMenuLevelEnum.APP);
  //   const blockFind = find(blocks, (i) => i.id === id0.id);
  //   if (blockFind) {
  //     setMenuSelAppId(blockFind.id);
  //     setMenuTree(blockFind.children || []);
  //   } else {
  //     setMenuTree([]);
  //   }
  //
  //   // sider同步打开位置
  //   const menuIds = restIds.map((i) => i.id);
  //   setMenuSelPath(menuIds);
  //   setOpenSideMenuKeys(collapse ? [] : menuIds);
  // }

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
      const tabItem = find(openTabs, (i) => i.key === openMenuId);
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
    setOpenSideMenuKeys(collapse ? [] : menuIds);

    // 加入已经打开的tabs
    const tab = find(openTabs, (i) => i.key === menu.id);
    if (isNil(tab)) {
      const tabItem = transMenuToTabItem(menu);
      setOpenTabs([...openTabs, tabItem]);
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
      // console.log('setMenuSelPath')
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
    openTabs,
    curTab,
    setCurTab: (tab: OpenTabsItem | undefined) => {
      // console.log('setCurTab')
      syncOpenMenuById(tab?.key, menuFullTree);
    },
    setOpenTabs,
    addTab: (tab1: OpenTabsItem) => {
      const newTab: OpenTabsItem = { ...tab1, linkMenuId: menuSelMenuId };
      // console.log('add tab', newTab)
      const tabFind = find(openTabs, (i) => i.key === newTab.key); // 查找已打开的tab
      if (tabFind) {
        syncOpenMenuById(tabFind.key, menuFullTree);
      } else {
        setOpenTabs([...openTabs, newTab]);
        setCurTab(newTab);
        navigateTab(newTab);
        setTimeout(() => {
          syncOpenMenuById(newTab.key, menuFullTree);
        }, 100);
      }
      // cache tab info
      setFaTabCache({ ...faTabCache, [newTab.path]: newTab });
    },
    removeTab: (tabKey: string) => {
      // console.log('close tab', tabKey)
      setOpenTabs(openTabs.filter((i) => i.key !== tabKey));
    },
    selTab: (tabKey: string) => {
      // console.log('selTab')
      syncOpenMenuById(tabKey, menuFullTree);
    },
  };

  const faUiContextValue: FaUiContextProps = {
    permissions: menuList.map((m) => m.linkUrl),
  };

  const width = collapse ? 'calc(100% - 44px)' : 'calc(100% - 200px)';
  return (
    <MenuLayoutContext.Provider value={contextValue}>
      <FaUiContext.Provider value={faUiContextValue}>
        <Layout style={{ height: '100vh', width: '100vw' }}>
          <Helmet title={`${curTab ? curTab.name + ' | ' : ''}${systemConfig.title}`} />

          <Layout.Header className="fa-menu-header">
            <Logo />
            <MenuAppHorizontal />
            {/*<LangToggle />*/}
            <WxMiniApp />
            <HelpCube />
            <MsgBadgeCube />
            <UserAvatar />
          </Layout.Header>

          <Layout style={{ flexDirection: 'row' }} className="fa-main-layout">
            <SideMenu />

            <Layout style={{ width }} className="fa-main-layout-right">
              <div className="fa-full fa-flex-column">
                {showTabs && <OpenTabs />}
                <FaFlexRestLayout>
                  <div className="fa-main">{hasPermission ? children : <Empty description="页面丢失了" />}</div>
                </FaFlexRestLayout>
              </div>
            </Layout>
          </Layout>
        </Layout>
      </FaUiContext.Provider>
    </MenuLayoutContext.Provider>
  );
}
