import React, { useContext, useEffect } from 'react';
import { Menu } from 'antd';
import { FaEnums, ThemeLayoutContext } from '@fa/ui';
import { FaIcon } from '@fa/icons';
import MenuLayoutContext from '../context/MenuLayoutContext';
import { ConfigLayoutContext } from '../../config/context/ConfigLayoutContext';

/**
 * 顶部水平的菜单
 * @author xu.pengfei
 * @date 2022/9/23
 */
export default function MenuAppHorizontal() {
  const { themeDark } = useContext(ThemeLayoutContext);
  const { systemConfig } = useContext(ConfigLayoutContext);
  const { menuFullTree, menuSelAppId, setMenuSelAppId } = useContext(MenuLayoutContext);

  useEffect(() => {
    // 设置-顶部菜单条样式
    if (systemConfig.topMenuBarStyle === 'color') {
      document.body.setAttribute('fa-menu-theme', 'color');
    } else {
      document.body.removeAttribute('fa-menu-theme');
    }
  }, []);

  const blocks = menuFullTree.filter((i) => i.sourceData.level === FaEnums.RbacMenuLevelEnum.APP);
  const items = blocks.map((i) => ({
    key: i.id,
    label: i.name,
    icon: i.sourceData.icon ? (
      <div className="fa-flex-column-center" style={{ width: 20 }}>
        <FaIcon icon={i.sourceData.icon} />
      </div>
    ) : null,
  }));

  return (
    <Menu
      className="fa-menu-top"
      mode="horizontal"
      theme={themeDark ? 'dark' : 'light'}
      items={items}
      selectedKeys={menuSelAppId ? [menuSelAppId] : []}
      onSelect={({ key }) => setMenuSelAppId(key)}
      style={{ flex: 1 }}
    />
  );
}
