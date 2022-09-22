import React from 'react';
import {LayoutProps} from "@/props/base";
import {Empty, Layout} from "antd";
import styles from "@/layout/styles/UserMenuLayout.module.less";
import {FormattedMessage} from "react-intl";
import SideMenu from "@/layout/menu/cube/SideMenu";
import LangToggle from "@/layout/cube/LangToggle";
import HelpCube from "@/layout/cube/HelpCube";
import UserAvatar from "@/layout/cube/UserAvatar";

/**
 * @author xu.pengfei
 * @date 2022/9/22 22:23
 */
export default function MenuLayout({ children }: LayoutProps.BaseChildProps) {


  const hasRoutePermission = true; // TODO 判断是否有路由权限
  return (
    <Layout style={{ height: '100vh', width: '100vw' }}>
      <Layout.Header className={styles.header}>
        <LangToggle />
        <HelpCube />
        <UserAvatar />
      </Layout.Header>

      <Layout style={{ flexDirection: 'row' }}>
        <SideMenu />

        <Layout style={{ width: 'calc(100% - 200px)' }}>
          {hasRoutePermission ? (
            <>
              {/* TODO 路由展示 */}
              <div style={{ padding: 8, margin: 0, overflowX: 'hidden', overflowY: 'auto', position: 'relative', height: '100%' }}>
                {children}
              </div>
            </>
          ) : (
            <Empty description={<FormattedMessage id="app.exception.description.403" />} />
          )}
        </Layout>
      </Layout>
    </Layout>
  )
}
