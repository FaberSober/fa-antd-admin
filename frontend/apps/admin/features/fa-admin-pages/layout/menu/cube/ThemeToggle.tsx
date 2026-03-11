import React, { useContext } from 'react';
import FaIconPro from '@features/fa-admin-pages/components/icons/FaIconPro';
import { ThemeLayoutContext } from '@fa/ui';
import { Tooltip } from 'antd';

/**
 * 顶部导航栏亮色/暗色主题切换按钮
 * @author xu.pengfei
 * @date 2026-03-11
 */
export default function ThemeToggle() {
  const { themeDark, setThemeDark } = useContext(ThemeLayoutContext);

  return (
    <div className="fa-flex-center">
      <Tooltip title={themeDark ? '切换亮色' : '切换暗色'} placement="bottomRight">
        <a className="fa-menu-anim-button" onClick={() => setThemeDark(!themeDark)}>
          {themeDark ? <FaIconPro icon="mdi:weather-sunny" /> : <FaIconPro icon="mdi:weather-night" />}
        </a>
      </Tooltip>
    </div>
  );
}