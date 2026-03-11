import React, { useContext } from 'react';
import MenuLayoutContext from '../context/MenuLayoutContext';
import { Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';

export interface MenuCollapseProps {
}

/**
 * @author xu.pengfei
 * @date 2026-03-03 09:57:17
 */
export default function MenuCollapse({}: MenuCollapseProps) {
  const { collapse, setCollapse } = useContext(MenuLayoutContext);

  return (
    <div className='fa-flex-center'>
      {collapse ? (
        <Button type="text" icon={<MenuUnfoldOutlined />} onClick={() => setCollapse(false)} />
      ) : (
        <Button type="text" icon={<MenuFoldOutlined />} onClick={() => setCollapse(true)} />
      )}
    </div>
  );
}