import React, { ReactNode, useCallback, useState } from 'react';
import { Button, Modal } from 'antd';
import { ModalProps } from 'antd/es/modal';
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons';
import { FaDragItem } from '@fa/ui';

export interface FaModalProps extends ModalProps {
  children?: JSX.Element;
  defaultFullScreen?: boolean;
  triggerDom?: ReactNode;
}

/**
 * antd v.4.7.0 新增可拖动Modal.
 * 1. 本例修改基于dnd-kit实现。减少包的引入
 * 2. 官网基于react-draggable实现。
 */
export default function FaModal({ defaultFullScreen, width, triggerDom, onCancel, ...props }: FaModalProps) {
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [fullScreen, setFullScreen] = useState(defaultFullScreen || false);
  const { title, ...restProps } = props;

  // 切换全屏状态的函数 <--- 关键逻辑
  const toggleFullScreen = useCallback(() => {
    setFullScreen(prev => !prev);
  }, []);

  return (
    <>
      <div onClick={() => setOpen(true)}>{triggerDom}</div>
      <Modal
        title={
          <div>
            <div
              style={{
                width: '100%',
                cursor: fullScreen ? 'default' : 'move', // 全屏时禁用拖动手柄的视觉效果
                backgroundColor: 'transparent',
                // 确保鼠标移出后拖动状态不会马上重置
                userSelect: 'none',
              }}
              onMouseOver={() => {
                if (disabled && !fullScreen) {
                  setDisabled(false);
                }
              }}
              onMouseOut={() => {
                // 只有在非全屏状态下才允许设置disabled
                if (!fullScreen) {
                  setDisabled(true);
                }
              }}
            >
              {title}
            </div>

            {/* 全屏切换按钮 */}
            <Button
              icon={fullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
              onClick={toggleFullScreen}
              type="text"
              style={{ marginRight: 0, position: 'absolute', top: 11, right: 50, color: 'rgba(0,0,0,0.45)' }} // 调整样式
              title={fullScreen ? '退出全屏' : '全屏'}
            />
          </div>
        }
        modalRender={(modal) => fullScreen ? modal : (
          <FaDragItem disabled={disabled} hold>
            {modal}
          </FaDragItem>
        )}
        destroyOnHidden
        maskClosable={!fullScreen} // 全屏时通常不希望点击蒙层关闭
        keyboard={!fullScreen}     // 全屏时通常不希望按 Esc 键关闭
        wrapClassName={fullScreen ? 'fa-full-screen-modal-wrap' : ''}
        // 全屏时可以把宽度设为 100vw，高度设为 100vh
        width={fullScreen ? '100vw' : width || 600}
        // 如果需要，设置全屏时距离顶部的距离为 0
        style={fullScreen ? { top: 0, padding: 0 } : {}}
        // 移除 Modal 自身的 body 内边距，让内容完全铺满
        styles={{
          body: fullScreen ? { height: 'calc(100vh - 55px - 53px)', overflow: 'auto' } : {}
        }}
        open={open}
        onCancel={(e) => {
          setOpen(false)
          if (onCancel) onCancel(e)
        }}
        {...restProps}
      />
    </>
  );
}
