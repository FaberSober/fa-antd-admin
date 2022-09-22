import React, {useContext} from 'react';
import {Menu} from "antd";
import {isNil} from "lodash"
import {UserLayoutContext} from "@/layout/UserLayout";
import FaberBase from "@/props/base/FaberBase";
import Rbac from "@/props/rbac";

/**
 * @author xu.pengfei
 * @date 2022/9/22 22:29
 */
export default function SideMenu() {
  const { menuTree } = useContext(UserLayoutContext)

  // const items = [
  //   { label: '菜单项一', key: 'item-1' }, // 菜单项务必填写 key
  //   { label: '菜单项二', key: 'item-2' },
  //   {
  //     label: '子菜单',
  //     key: 'submenu',
  //     children: [{ label: '子菜单项', key: 'submenu-item-1' }],
  //   },
  // ];

  function loop(list: FaberBase.TreeNode<Rbac.RbacMenu>[] | undefined): any[] | undefined {
    if (isNil(list) || list.length === 0) return undefined;
    return list.map((i) => ({
      key: i.id,
      label: i.name,
      children: loop(i.children),
    }))
  }

  const items = loop(menuTree)

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
