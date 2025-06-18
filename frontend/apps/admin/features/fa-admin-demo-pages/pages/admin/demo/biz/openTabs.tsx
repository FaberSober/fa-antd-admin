import React, { useContext } from 'react';
import { Button, Card, Space } from "antd";
import { MenuLayoutContext } from "@features/fa-admin-pages/layout";

/**
 * @author xu.pengfei
 * @date 2023/1/31 10:09
 */
export default function openTabs() {
  const {addTab, removeTab} = useContext(MenuLayoutContext)

  function handleAddTabIframe() {
    addTab({
      key: 'baidu',
      path: 'https://cn.bing.com/',
      name: 'bing',
      type: 'iframe', // iframe, inner-内部网页
      closeable: true,
    })
  }

  function handleAddTabInner() {
    addTab({
      key: '/admin/system/account/base',
      path: '/admin/system/account/base',
      name: '个人中心tab',
      type: 'inner', // iframe, inner-内部网页
      closeable: true,
    })
  }

  function handleCloseTabIframe() {
    removeTab('baidu')
  }

  function handleCloseTabInner() {
    removeTab('/admin/system/account/base')
  }

  return (
    <div className="fa-full-content fa-p12">
      <Card title="顶部Tab标签栏操作" className="fa-mb12">
        <Space>
          <Button onClick={handleAddTabIframe}>打开标签页(iframe)</Button>
          <Button onClick={handleAddTabInner}>打开标签页(inner-内部网页)</Button>
          <Button onClick={handleCloseTabIframe}>关闭标签页(iframe)</Button>
          <Button onClick={handleCloseTabInner}>关闭标签页(inner-内部网页)</Button>
        </Space>
      </Card>
    </div>
  )
}