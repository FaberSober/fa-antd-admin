import React, {useContext} from 'react';
import {Menu} from "antd";
import {isNil} from "lodash"
import FaberBase from "@/props/base/FaberBase";
import Rbac from "@/props/rbac";
import MenuLayoutContext from "@/layout/menu/context/MenuLayoutContext";

/**
 * @author xu.pengfei
 * @date 2022/9/22 22:29
 */
export default function SideMenu() {
  const { menuTree } = useContext(MenuLayoutContext)

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
    <div className="faber-flex-column" style={{ width: 200, height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
      <Menu
        // theme="dark"
        mode="inline"
        // openKeys={openKeys}
        // onOpenChange={onOpenChange}
        style={{ width: 200 }}
        items={items}
      />
    </div>
  )
}
