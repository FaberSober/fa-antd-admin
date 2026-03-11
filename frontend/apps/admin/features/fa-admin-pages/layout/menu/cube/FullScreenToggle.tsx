import FaIconPro from '@features/fa-admin-pages/components/icons/FaIconPro';
import { useFullscreen } from 'ahooks';
import { Tooltip } from 'antd';

/**
 * 顶部导航栏全屏切换按钮
 * @author xu.pengfei
 * @date 2026-03-11
 */
export default function FullScreenToggle() {
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(document.body);

  return (
    <div className="fa-flex-center">
      <Tooltip title={isFullscreen ? '退出全屏' : '全屏'} placement="bottomRight">
        <a className="fa-menu-anim-button" onClick={toggleFullscreen}>
          {isFullscreen ? <FaIconPro icon="mdi:fullscreen-exit" /> : <FaIconPro icon="mdi:fullscreen" />}
        </a>
      </Tooltip>
    </div>
  );
}