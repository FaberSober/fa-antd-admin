import React, { useContext, useEffect } from 'react';
import { FaEnums } from '@fa/ui';
import clsx from 'clsx';
import MenuLayoutContext from '../context/MenuLayoutContext';
import { ConfigLayoutContext } from '../../config/context/ConfigLayoutContext';
import './MenuAppHorizontal.scss'
import FaIconPro from '@features/fa-admin-pages/components/icons/FaIconPro';

/**
 * 顶部水平的菜单
 * @author xu.pengfei
 * @date 2022/9/23
 */
export default function MenuAppHorizontal() {
  const { systemConfig } = useContext(ConfigLayoutContext);
  const { menuFullTree, menuSelAppId, setMenuSelAppId } = useContext(MenuLayoutContext);

  // useEffect(() => {
  //   // 设置-顶部菜单条样式
  //   if (systemConfig.topMenuBarStyle === 'color') {
  //     document.body.setAttribute('fa-menu-theme', 'color');
  //   } else {
  //     document.body.removeAttribute('fa-menu-theme');
  //   }
  // }, [systemConfig.topMenuBarStyle]);

  const blocks = menuFullTree.filter((i) => i.sourceData.level === FaEnums.RbacMenuLevelEnum.APP);

  return (
    <div className="fa-menu-top-container">
      {blocks.map(bl => {
        const isActive = bl.id === menuSelAppId;
        return (
          <div
            key={bl.id}
            className={clsx('fa-menu-top-item', isActive && 'fa-menu-top-item-active')}
            onClick={() => setMenuSelAppId(bl.id)}
          >
            {bl.sourceData.icon && (
              <span className="fa-menu-top-item-icon">
                <FaIconPro icon={bl.sourceData.icon} />
              </span>
            )}
            <span className="fa-menu-top-item-text">{bl.name}</span>
          </div>
        )
      })}
    </div>
  );
}
