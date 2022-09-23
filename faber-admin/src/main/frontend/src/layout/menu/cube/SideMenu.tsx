import React, {useContext} from 'react';
import {Menu} from "antd";
import {isNil} from "lodash"
import FaberBase from "@/props/base/FaberBase";
import Rbac from "@/props/rbac";
import MenuLayoutContext from "@/layout/menu/context/MenuLayoutContext";
import {DoubleLeftOutlined, DoubleRightOutlined} from "@ant-design/icons";
import {FaFlexRestLayout} from "@/components/base-layout";

/**
 * @author xu.pengfei
 * @date 2022/9/22 22:29
 */
export default function SideMenu() {
  const { menuTree, collapse, setCollapse } = useContext(MenuLayoutContext)

  function loop(list: FaberBase.TreeNode<Rbac.RbacMenu>[] | undefined): any[] | undefined {
    if (isNil(list) || list.length === 0) return undefined;
    return list.map((i) => ({
      key: i.id,
      label: i.name,
      children: loop(i.children),
    }))
  }

  const items = loop(menuTree)

  const width = collapse ? 44 : 200
  return (
    <div className="faber-flex-column" style={{ width, height: '100%', backgroundColor: '#fff' }}>
      <FaFlexRestLayout style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <Menu
          // theme="dark"
          mode="inline"
          // openKeys={openKeys}
          // onOpenChange={onOpenChange}
          style={{ width }}
          items={items}
          inlineCollapsed={collapse}
        />
      </FaFlexRestLayout>

      <div
        className="sider-toggle-div"
        style={{ width }}
        onClick={() => setCollapse(!collapse)}
      >
        {collapse ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
      </div>
    </div>
  )
}
