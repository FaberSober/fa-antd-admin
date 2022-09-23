import React, {useEffect, useState} from 'react';
import {Empty, Layout} from "antd";
import {find, isNil} from 'lodash';
import {FormattedMessage} from "react-intl";
import {useNavigate} from "react-router-dom";
import {FaFlexRestLayout} from "@/components/base-layout";
import FaberEnums from "@/props/base/FaberEnums";
import Rbac from "@/props/rbac";
import {flatTreeList} from "@/utils/treeUtils";
import {FaberBase, LayoutProps} from "@/props/base";
import rbacUserRoleApi from "@/services/rbac/rbacUserRole";
import MenuLayoutContext, {MenuLayoutContextProps} from './context/MenuLayoutContext'
import Logo from "./cube/Logo";
import MenuAppHorizontal from "./cube/MenuAppHorizontal";
import SideMenu from "./cube/SideMenu";
import LangToggle from "@/layout/menu/cube/LangToggle";
import HelpCube from "@/layout/menu/cube/HelpCube";
import UserAvatar from "@/layout/menu/cube/UserAvatar";
import OpenTabs from "@/layout/menu/cube/OpenTabs";
import styles from "./MenuLayout.module.less";


/**
 * @author xu.pengfei
 * @date 2022/9/22 22:23
 */
export default function MenuLayout({children}: LayoutProps.BaseChildProps) {
  const navigate = useNavigate();

  const [menuList, setMenuList] = useState<Rbac.RbacMenu[]>([]);
  const [menuFullTree, setMenuFullTree] = useState<FaberBase.TreeNode<Rbac.RbacMenu>[]>([]);
  const [menuTree, setMenuTree] = useState<FaberBase.TreeNode<Rbac.RbacMenu>[]>([]);
  const [menuSelAppId, setMenuSelAppId] = useState<string>();
  const [menuSelMenuId, setMenuSelMenuId] = useState<string>();
  const [menuSelPath, setMenuSelPath] = useState<string[]>([]);
  const [collapse, setCollapse] = useState<boolean>(false);
  const [openSideMenuKeys, setOpenSideMenuKeys] = useState<string[]>([]);
  const [openTabs, setOpenTabs] = useState<Rbac.RbacMenu[]>([]);

  useEffect(() => {
    rbacUserRoleApi.getMyMenusTree().then((res) => {
      setMenuFullTree(res.data)
      setMenuList(flatTreeList(res.data))

      const blocks = res.data.filter((i) => i.sourceData.level === FaberEnums.RbacMenuLevelEnum.APP)
      if (blocks.length > 0) {
        setMenuSelAppId(blocks[0].id)
        setMenuTree(blocks[0].children || [])
      } else {
        setMenuTree([])
      }
    })
  }, [])

  const contextValue: MenuLayoutContextProps = {
    menuFullTree,
    menuList,
    menuTree,
    menuSelAppId,
    menuSelPath,
    menuSelMenuId,
    setMenuSelMenuId: (id) => {
      setMenuSelMenuId(id)
      const menu = find(menuList, (i) => i.id === id) as Rbac.RbacMenu
      // 打开页面
      navigate(menu.linkUrl)
    },
    setMenuSelPath: (key: string, keyPath: string[]) => {
      setMenuSelMenuId(key)
      setMenuSelPath(keyPath)
      const menu = find(menuList, (i) => i.id === key) as Rbac.RbacMenu

      // 加入已经打开的tabs
      const tab = find(openTabs, (i) => i.id === menu.id)
      if (isNil(tab)) {
        setOpenTabs([ ...openTabs, menu ])
      }

      // 打开页面
      navigate(menu.linkUrl)
    },
    setMenuSelAppId: (id) => {
      setMenuSelAppId(id)
      const selTree = find(menuFullTree, (i) => i.sourceData.id === id)
      setMenuTree(selTree && selTree.children ? selTree.children : [])
      setMenuSelPath([])
    },
    collapse,
    setCollapse,
    openSideMenuKeys,
    setOpenSideMenuKeys,
    openTabs,
    setOpenTabs,
  };

  const hasRoutePermission = true; // TODO 判断是否有路由权限
  const width = collapse ? 'calc(100% - 44px)' : 'calc(100% - 200px)';
  return (
    <MenuLayoutContext.Provider value={contextValue}>
      <Layout style={{height: '100vh', width: '100vw'}}>
        <Layout.Header className={styles.header}>
          <Logo />
          <MenuAppHorizontal/>
          <LangToggle/>
          <HelpCube/>
          <UserAvatar/>
        </Layout.Header>

        <Layout style={{flexDirection: 'row'}}>
          <SideMenu/>

          <Layout style={{ width }}>
            {hasRoutePermission ? (
              <div className="faber-full faber-flex-column">
                <OpenTabs />
                <FaFlexRestLayout>
                  <div className="faber-main">
                    {children}
                  </div>
                </FaFlexRestLayout>
              </div>
            ) : (
              <Empty description={<FormattedMessage id="app.exception.description.403"/>}/>
            )}
          </Layout>
        </Layout>
      </Layout>
    </MenuLayoutContext.Provider>
  )
}
