import React, { CSSProperties } from 'react';
import { FullscreenExitOutlined, FullscreenOutlined } from "@ant-design/icons";
import { useFullscreen } from "ahooks";

export interface FaFullscreenBtnProps {
  target: any;
  style?: CSSProperties;
}

/**
 * 全屏切换按钮
 * @author xu.pengfei
 * @date 2023/2/23 13:49
 */
export default function FaFullscreenBtn({target, style}: FaFullscreenBtnProps) {
  const [isFullscreen, {toggleFullscreen}] = useFullscreen(target);
  return (
    <div className="fa-normal-btn" style={{height: 32, padding: 0, ...style}} onClick={toggleFullscreen}>
      {isFullscreen ? <FullscreenOutlined/> : <FullscreenExitOutlined/>}
    </div>
  )
}
