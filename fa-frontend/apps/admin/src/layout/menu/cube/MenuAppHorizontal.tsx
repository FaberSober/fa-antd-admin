import React, { useContext } from 'react';
import { Menu } from 'antd';
import { FaEnums } from '@/types';
import MenuLayoutContext from '@/layout/menu/context/MenuLayoutContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * 顶部水平的菜单
 * @author xu.pengfei
 * @date 2022/9/23
 */
export default function MenuAppHorizontal() {
  const { menuFullTree, menuSelAppId, setMenuSelAppId } = useContext(MenuLayoutContext);

  const blocks = menuFullTree.filter((i) => i.sourceData.level === FaEnums.RbacMenuLevelEnum.APP);
  const items = blocks.map((i) => ({
    key: i.id,
    label: i.name,
    icon: i.sourceData.icon ? (
      <div className="fa-flex-column-center" style={{ width: 20, display: 'inline-block' }}>
        <FontAwesomeIcon icon={i.sourceData.icon} />
      </div>
    ) : null,
  }));
  return (
    <Menu
      mode="horizontal"
      theme="dark"
      items={items}
      selectedKeys={menuSelAppId ? [menuSelAppId] : []}
      onSelect={({ key }) => setMenuSelAppId(key)}
      style={{ flex: 1, border: 'none' }}
    />
  );
}
