import React, { useState } from 'react';
import { Modal } from 'antd';
import Draggable from 'react-draggable';
import { ModalProps } from 'antd/es/modal';

export interface DragModalProps extends ModalProps {
  children?: JSX.Element;
}

/* eslint-disable react/jsx-props-no-spreading */
/**
 * antd v.4.7.0 新增可拖动Modal
 */
function DragModal(props: DragModalProps) {
  const [disabled, setDisabled] = useState(true);
  const { title, ...restProps } = props;
  return (
    <Modal
      title={
        <div
          style={{
            width: '100%',
            cursor: 'move',
            margin: -12,
            padding: 12,
            backgroundColor: 'transparent',
          }}
          onMouseOver={() => {
            if (disabled) {
              setDisabled(false);
            }
          }}
          onMouseOut={() => {
            setDisabled(true);
          }}
          // fix eslintjsx-a11y/mouse-events-have-key-events
          // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/master/docs/rules/mouse-events-have-key-events.md
          onFocus={() => {}}
          onBlur={() => {}}
          // end
        >
          {title}
        </div>
      }
      modalRender={(modal) => <Draggable disabled={disabled}>{modal}</Draggable>}
      destroyOnClose
      maskClosable={false}
      {...restProps}
    />
  );
}

export default DragModal;
