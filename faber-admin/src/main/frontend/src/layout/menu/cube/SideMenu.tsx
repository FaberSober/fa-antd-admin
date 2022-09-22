import React, {useContext} from 'react';
import {UserLayoutContext} from "@/layout/UserLayout";
import {Menu} from "antd";

/**
 * @author xu.pengfei
 * @date 2022/9/22 22:29
 */
export default function SideMenu() {
  const { menuTree } = useContext(UserLayoutContext)

  const items = [
    { label: '菜单项一', key: 'item-1' }, // 菜单项务必填写 key
    { label: '菜单项二', key: 'item-2' },
    {
      label: '子菜单',
      key: 'submenu',
      children: [{ label: '子菜单项', key: 'submenu-item-1' }],
    },
  ];

  return (
    <Menu
      mode="inline"
      // openKeys={openKeys}
      // onOpenChange={onOpenChange}
      style={{ width: 200 }}
      items={items}
    />
  )
}
