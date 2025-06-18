import React, { useState } from 'react';
import { Modal } from 'antd';
import { ModalProps } from 'antd/es/modal';
import FaDragItem from '@ui/components/base-drag/FaDragItem';

export interface DragModalProps extends ModalProps {
  children?: JSX.Element;
}

/**
 * antd v.4.7.0 新增可拖动Modal.
 * 1. 本例修改基于dnd-kit实现。减少包的引入
 * 2. 官网基于react-draggable实现。
 */
export default function DragModal(props: DragModalProps) {
  const [disabled, setDisabled] = useState(true);
  const { title, ...restProps } = props;
  if (!props.open) return null;
  return (
    <Modal
      title={
        <div
          style={{
            width: '100%',
            cursor: 'move',
            backgroundColor: 'transparent',
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => setDisabled(true)}
        >
          {title}
        </div>
      }
      modalRender={(modal) => (
        <FaDragItem disabled={disabled} hold>
          {modal}
        </FaDragItem>
      )}
      destroyOnClose
      maskClosable={false}
      {...restProps}
    />
  );
}
