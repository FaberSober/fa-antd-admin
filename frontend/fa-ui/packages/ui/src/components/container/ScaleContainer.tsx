import React, { CSSProperties, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Tooltip } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import './index.css'
import { debounce } from 'lodash';

export interface ScaleContainerProps {
  width: number; // 宽-1920
  height: number; // 高-1080
  bodyProps?: any; // 内容DIV的属性
  defaultFullscreen?: boolean; // 初始化是否全屏-false
  showFullscreenBtn?: boolean; // 是否展示切换全屏的按钮-false
  equalRatio?: boolean; // 是否等比缩放-true
  children: ReactNode;
  topStyle?: CSSProperties;
  containerStyle?: CSSProperties;
}

/**
 * 等比缩放的组件，适用于大屏展示。如设计图为16:9的分辨率，宽度基本值为1920。
 *
 * @author xu.pengfei
 * @date 2021/1/23
 */
export default function ScaleContainer({
  children,
  width = 1920,
  height = 1080,
  bodyProps = {},
  defaultFullscreen = false,
  showFullscreenBtn = false,
  equalRatio = true,
  topStyle,
  containerStyle,
}: ScaleContainerProps) {
  const topId = useRef(uuidv4()).current;
  const [fullscreen, setFullscreen] = useState(defaultFullscreen);
  // 关键：用 ref 存比例，避免每次渲染都变
  const ratioRef = useRef({ ratioX: 1, ratioY: 1 });
  // 只有在真正需要更新时才触发渲染
  const [, forceUpdate] = useState({});

  // 防抖回调，避免每次重新创建
  const updateScaleRef = useRef(debounce(() => {
    const dom = document.getElementById(topId);
    if (!dom) return;

    const rect = dom.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const newRatioX = rect.width / width;
    const newRatioY = rect.height / height;

    // 精度保留4位小数，避免浮点误差导致无限更新
    const rX = Math.round(newRatioX * 10000) / 10000;
    const rY = Math.round(newRatioY * 10000) / 10000;

    if (
      Math.abs(rX - ratioRef.current.ratioX) > 0.0001 ||
      Math.abs(rY - ratioRef.current.ratioY) > 0.0001
    ) {
      ratioRef.current = { ratioX: rX, ratioY: rY };
      forceUpdate({}); // 触发重渲染
    }
  }, 200));

  // 使用 resize 事件，而不是每250ms轮询（更高效！）
  useEffect(() => {
    const updateScale = updateScaleRef.current;
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []); // 空依赖，只在挂载和卸载时执行

  // 全屏切换
  const handleToggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  // 计算最终比例
  const ratio = equalRatio
    ? Math.min(ratioRef.current.ratioX, ratioRef.current.ratioY)
    : Math.min(ratioRef.current.ratioX, ratioRef.current.ratioY);

  const innerContainerStyle: CSSProperties = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: `${width}px`,
    height: `${height}px`,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none', // 重要：让鼠标事件穿透到内部 canvas
  };

  const contentStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    transform: ratio !== 1 ? `scale(${ratio})` : undefined,
    transformOrigin: 'center center',
    pointerEvents: 'auto', // 内容层恢复事件
  };

  const containerStyles: CSSProperties = fullscreen
    ? { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }
    : { width: '100%', height: '100%' };
  return (
    <div
      id={topId}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#000',
        position: 'relative',
        ...topStyle,
      }}
    >
      <div style={{ ...containerStyles, ...containerStyle }}>
        <div style={innerContainerStyle}>
          <div style={contentStyle} {...bodyProps}>
            {showFullscreenBtn && (
              <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 999, color: '#fff' }}>
                <Tooltip title={fullscreen ? '退出全屏' : '全屏'}>
                  <a onClick={handleToggleFullscreen} style={{ fontSize: 24 }}>
                    {fullscreen ? <FullscreenOutlined /> : <FullscreenExitOutlined />}
                  </a>
                </Tooltip>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
