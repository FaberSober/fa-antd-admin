import React from 'react';
import { Card, Modal } from "antd";
import { Item, type ItemParams, Menu, useContextMenu } from 'react-contexify';
import { EditOutlined } from "@ant-design/icons";


/**
 * @author xu.pengfei
 * @date 2023/2/13 13:59
 */
export default function contextMenu() {
  const { show } = useContextMenu({
    id: 'menu_1',
  });

  function handleContextMenu(event: any, props: any) {
    show({ event, props });
  }

  const handleItemClick = ({ id, props }: ItemParams) => {
    const item = props as any;
    Modal.confirm({
      title: 'Menu Clicked',
      content: `click ${id}, props = ${JSON.stringify(item)}`
    })
  };

  return (
    <div className="fa-full-content fa-p12">
      <Card title="context menu右键菜单" className="fa-mb12">
        <p>使用<code>react-contexify</code>实现右键菜单</p>

        <div>
          <div
            className="fa-p8 fa-bg-grey"
            onContextMenu={(e) => handleContextMenu(e, {foo: 'bar'})}
          >
            右键
          </div>

          <Menu id='menu_1' className="contextMenu">
            <Item id="menu1" onClick={handleItemClick}>
              <EditOutlined style={{ width: 16 }} /> 菜单1
            </Item>
            <Item id="menu2" onClick={handleItemClick}>
              菜单2
            </Item>
            <Item id="menu3" onClick={handleItemClick}>
              菜单3
            </Item>
          </Menu>
        </div>
      </Card>
    </div>
  )
}
