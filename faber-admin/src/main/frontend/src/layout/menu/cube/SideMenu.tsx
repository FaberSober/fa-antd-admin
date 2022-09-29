import React, {useContext} from 'react';
import {Menu} from "antd";
import {isNil} from "lodash"
import FaberBase from "@/props/base/FaberBase";
import Rbac from "@/props/rbac";
import MenuLayoutContext from "@/layout/menu/context/MenuLayoutContext";
import {DoubleLeftOutlined, DoubleRightOutlined} from "@ant-design/icons";
import {FaFlexRestLayout} from "@/components/base-layout";
import FaberEnums from "@/props/base/FaberEnums";

/**
 * @author xu.pengfei
 * @date 2022/9/22 22:29
 */
export default function SideMenu() {
  const { menuTree, collapse, setCollapse, openSideMenuKeys, setOpenSideMenuKeys, menuSelPath, setMenuSelPath } = useContext(MenuLayoutContext)

  function loop(list: FaberBase.TreeNode<Rbac.RbacMenu>[] | undefined): any[] | undefined {
    if (isNil(list) || list.length === 0) return undefined;
    const menuList = list.filter(i => i.sourceData.level !== FaberEnums.RbacMenuLevelEnum.BUTTON);
    if (menuList.length === 0) return undefined;
    return menuList.map((i) => ({
      key: i.id,
      label: i.name,
      children: loop(i.children),
      icon: i.sourceData.icon ? <div className="faber-flex-column-center" style={{ width: 20, display: 'inline-block' }}><i className={i.sourceData.icon} /></div> : null,
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
    <div className="faber-flex-column" style={{ width, height: '100%', backgroundColor: '#fff', borderRight: '1px solid #eee' }}>
      <FaFlexRestLayout style={{ overflowY: 'auto', overflowX: 'hidden' }}>
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
      </FaFlexRestLayout>

      <div
        className="sider-toggle-div"
        style={{ width: width - 1 }}
        onClick={() => setCollapse(!collapse)}
      >
        {collapse ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
      </div>
    </div>
  )
}
