import React, {useContext} from 'react';
import {Menu} from "antd";
import {isNil} from "lodash"
import Fa from "@/props/base/Fa";
import Rbac from "@/props/rbac";
import MenuLayoutContext from "@/layout/menu/context/MenuLayoutContext";
import FaEnums from "@/props/base/FaEnums";
import {SiderLayout} from "@/components/antd-pro";


/**
 * @author xu.pengfei
 * @date 2022/9/22 22:29
 */
export default function SideMenu() {
  const { menuTree, collapse, setCollapse, openSideMenuKeys, setOpenSideMenuKeys, menuSelPath, setMenuSelPath } = useContext(MenuLayoutContext)

  function loop(list: Fa.TreeNode<Rbac.RbacMenu>[] | undefined): any[] | undefined {
    if (isNil(list) || list.length === 0) return undefined;
    const menuList = list.filter(i => i.sourceData.level !== FaEnums.RbacMenuLevelEnum.BUTTON);
    if (menuList.length === 0) return undefined;
    return menuList.map((i) => ({
      key: i.id,
      label: i.name,
      children: loop(i.children),
      icon: i.sourceData.icon ? <div className="fa-flex-column-center" style={{ width: 14, display: 'inline-block' }}><i className={i.sourceData.icon} /></div> : null,
    }))
  }
  const items = loop(menuTree)

  const rootSubmenuKeys = menuTree.map(i => i.id)
  const onOpenChange = (keys:string[]) => {
    const latestOpenKey = keys.find(key => openSideMenuKeys.indexOf(key) === -1);
    if (rootSubmenuKeys.indexOf(latestOpenKey!) === -1) {
      setOpenSideMenuKeys(keys);
    } else {
      setOpenSideMenuKeys(latestOpenKey ? [latestOpenKey] : []);
    }
  };

  const width = collapse ? 44 : 200
  return (
    <SiderLayout collapse={collapse} onCollapse={() => setCollapse(!collapse)}>
      <Menu
        // theme="dark"
        mode="inline"
        // openKeys={openKeys}
        // onOpenChange={onOpenChange}
        style={{ width }}
        items={items}
        inlineCollapsed={collapse}
        openKeys={openSideMenuKeys}
        onOpenChange={onOpenChange}
        selectedKeys={menuSelPath}
        onSelect={({ key, keyPath}) => setMenuSelPath(key, keyPath)}
      />
    </SiderLayout>
  )
}
