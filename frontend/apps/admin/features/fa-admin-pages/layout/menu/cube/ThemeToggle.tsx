import React, { useContext } from 'react';
import FaIconPro from '@features/fa-admin-pages/components/icons/FaIconPro';
import { ThemeLayoutContext } from '@fa/ui';
import { Tooltip } from 'antd';
import './ThemeToggle.scss'

/**
 * 顶部导航栏亮色/暗色主题切换按钮
 * 支持 View Transitions API 圆形发散动画
 * @author xu.pengfei
 * @date 2026-03-11
 */
export default function ThemeToggle() {
  const { themeDark, setThemeDark } = useContext(ThemeLayoutContext);

  function handleToggle(e: React.MouseEvent<HTMLAnchorElement>) {
    const nextDark = !themeDark;

    // 1. 获取点击坐标
    const x = e.clientX;
    const y = e.clientY;

    // 2. 计算扩散半径（点击点到屏幕最远角的距离）
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    // 3. 将坐标和半径写入 CSS 变量
    const root = document.documentElement;
    root.style.setProperty('--theme-x', `${x}px`);
    root.style.setProperty('--theme-y', `${y}px`);
    root.style.setProperty('--theme-radius', `${endRadius}px`);

    // 4. 降级：浏览器不支持 View Transitions 时直接切换
    if (!('startViewTransition' in document)) {
      setThemeDark(nextDark);
      return;
    }

    // 5. 根据切换方向添加对应类名（发散 or 收缩）
    root.classList.remove('theme-transition', 'theme-transition-reverse');
    root.classList.add(nextDark ? 'theme-transition-reverse' : 'theme-transition');

    // 6. 执行视图过渡
    const transition = (document as any).startViewTransition(() => {
      setThemeDark(nextDark);
    });

    // 7. 动画结束后清理类名
    transition.finished.then(() => {
      root.classList.remove('theme-transition', 'theme-transition-reverse');
    });
  }

  return (
    <div className="fa-flex-center">
      <Tooltip title={themeDark ? '切换亮色' : '切换暗色'} placement="bottomRight">
        <a className="fa-menu-anim-button" onClick={handleToggle}>
          {themeDark ? <FaIconPro icon="mdi:weather-sunny" /> : <FaIconPro icon="mdi:weather-night" />}
        </a>
      </Tooltip>
    </div>
  );
}