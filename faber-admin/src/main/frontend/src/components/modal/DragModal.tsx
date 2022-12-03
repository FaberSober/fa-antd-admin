import React, {useState} from 'react';
import {Modal} from 'antd';
import Draggable from 'react-draggable';
import {ModalProps} from 'antd/es/modal';
import FaDragItem from "@/components/base-drag/FaDragItem";

export interface DragModalProps extends ModalProps {
  children?: JSX.Element;
}

/* eslint-disable react/jsx-props-no-spreading */
/**
 * antd v.4.7.0 新增可拖动Modal
 */
function DragModal(props: DragModalProps) {
  const [disabled, setDisabled] = useState(true);
  const { title, ...restProps } = props;
  if (!props.open) return null;
  return (
    <Modal
      // title={
      //   <div
      //     style={{
      //       width: '100%',
      //       cursor: 'move',
      //       backgroundColor: 'transparent',
      //     }}
      //     onMouseOver={() => {
      //       if (disabled) {
      //         setDisabled(false);
      //       }
      //     }}
      //     onMouseOut={() => setDisabled(true)}
      //   >
      //     {title}
      //   </div>
      // }
      title={title}
      modalRender={(modal) => <FaDragItem hold handle handleStyle={{ position: 'absolute', top: -40, left: 0, right: 50, height: 40, backgroundColor: '#F00' }}>{modal}</FaDragItem>}
      destroyOnClose
      maskClosable={false}
      {...restProps}
    />
  );
}

export default DragModal;
