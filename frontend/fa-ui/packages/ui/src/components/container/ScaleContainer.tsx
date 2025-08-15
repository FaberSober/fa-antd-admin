import React, { CSSProperties, ReactNode, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useInterval } from 'react-use';
import { Tooltip } from 'antd';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import './index.css'

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
  const [state, setState] = useState({
    fullscreen: defaultFullscreen,
    topId: uuidv4(),
    topContainerId: uuidv4(),
    ratioX: 1, // 默认缩放比例:X
    ratioY: 1, // 默认缩放比例:Y
  });

  /** 界面大小变化，重新计算缩放 */
  useInterval(() => {
    const { ratioX, ratioY, topId, topContainerId } = state;
    const topDom = document.getElementById(topId);
    if (topDom) {
      const rect = topDom.getBoundingClientRect();
      if (rect && rect.width > 0) {
        const newRatioX = rect.width / width; // 以1920px为基础
        if (newRatioX !== ratioX) {
          setState({ ...state, ratioX: newRatioX });
        }
      }
      if (rect && rect.height > 0) {
        const newRatioY = rect.height / height; // 以1080px为基础
        if (newRatioY !== ratioY) {
          setState({ ...state, ratioY: newRatioY });
        }
      }
    }

    // const topContainerDom = document.getElementById(topContainerId);
    // if (topContainerDom) {
    //   const rect = topContainerDom.getBoundingClientRect();
    //   if (rect && rect.width > 0) {
    //     const newRatioX = rect.width / width; // 以1920px为基础
    //     if (newRatioX !== ratioX) {
    //       setState({ ...state, ratioX: newRatioX });
    //     }
    //   }
    //   if (rect && rect.height > 0) {
    //     const newRatioY = rect.height / height; // 以1080px为基础
    //     if (newRatioY !== ratioY) {
    //       setState({ ...state, ratioY: newRatioY });
    //     }
    //   }
    // }
  }, 250);

  function handleToggleFullscreen() {
    setState({ ...state, fullscreen: !state.fullscreen });
  }

  // 切换全屏按钮
  console.log('ratioX', state.ratioX, 'ratioY', state.ratioY)
  let topContainerStyles: CSSProperties = {
    width: '100%',
    height: '100%',
    // height: `${height * state.ratioX}px`,
    backgroundColor: 'transparent',
    zIndex: 99,
  };
  if (state.ratioX >= state.ratioY) {
    topContainerStyles.width = `${width * state.ratioY}px`
  } else {
    topContainerStyles.height = `${height * state.ratioX}px`
  }
  if (state.fullscreen) {
    topContainerStyles = {
      ...topContainerStyles,
      // height: `${height / state.ratioY}px`,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    };
  }

  // 计算缩放
  let scaleStyles: CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    position: 'relative',
  };
  if (state.ratioX !== 1 || state.ratioY !== 1) {
    const ratio = state.ratioX >= state.ratioY ? state.ratioY : state.ratioX;
    scaleStyles = {
      ...scaleStyles,
      transform: equalRatio
        ? `scaleX(${ratio}) scaleY(${ratio})`
        : `scaleX(${ratio}) scaleY(${ratio})`,
      transformOrigin: 'left top',
    };
  }

  const fullscreenToggleBtnDivStyle: CSSProperties = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 9,
  };

  return (
    <div className="fa-ui-scale-container" style={{ ...topStyle }} id={state.topId}>
      <div style={{...topContainerStyles, ...containerStyle}} id={state.topContainerId}>
        <div style={scaleStyles} {...bodyProps}>
          {/* 切换全屏按钮 */}
          {showFullscreenBtn ? (
            <div style={fullscreenToggleBtnDivStyle}>
              <Tooltip title={state.fullscreen ? '退出全屏' : '全屏'}>
                <a onClick={handleToggleFullscreen} style={{color: '#FFF'}}>
                  {state.fullscreen ? <FullscreenOutlined/> : <FullscreenExitOutlined/>}
                </a>
              </Tooltip>
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </div>
  );
}
