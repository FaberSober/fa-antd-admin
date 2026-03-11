import { ReloadOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useContext } from 'react';
import MenuLayoutContext from '../context/MenuLayoutContext';

/**
 * @author xu.pengfei
 * @date 2026-03-09 15:46:15
 */
export default function MenuRefresh() {
  const { curTab, reloadTab } = useContext(MenuLayoutContext);

  function reloadCurTab() {
    if (curTab?.key) {
      reloadTab(curTab.key);
    }
  }

  return (
    <div className='fa-flex-center'>
      <Button type="text" icon={<ReloadOutlined />} onClick={() => reloadCurTab()} />
    </div>
  );
}