import React, {CSSProperties, ReactNode} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import {Button} from "antd";
import styles from "@/components/base-drag/index.module.less";
import {MenuOutlined} from "@ant-design/icons";


export interface FaSortItemProps {
  id: any,
  handle?: boolean;
  handleNode?: ReactNode;
  style?: CSSProperties;
  handleStyle?: CSSProperties;
  children?: ReactNode;
  vertical?: boolean;
  dragging?: boolean;
}

/**
 * @author xu.pengfei
 * @date 2022/12/3 9:54
 */
export default function FaSortItem({ id, style, handle, handleNode, handleStyle, children, vertical, dragging }:FaSortItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({id: id});

  const styleTrans: CSSProperties = {
    // transform: CSS.Transform.toString(transform),
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '',
    transition,
    cursor: handle ? 'default' : 'grab',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: dragging ? 999 : undefined,
    boxShadow: dragging ? '8px 8px 8px rgba(0, 21, 41, 0.08)' : undefined,
    backgroundColor: '#FFF',
    position: 'relative',
  };
  if (vertical) {
    styleTrans.transform = transform ? `translate3d(${vertical ? 0 : transform.x}px, ${vertical ? transform.y : 0}px, 0)` : '';
  }

  return (
    <div ref={setNodeRef} style={{ ...styleTrans, ...style }} {...(handle ? {} : listeners)} {...attributes}>
      {children}
      {handle && (
        <div className={styles.dragHandle} style={handleStyle} {...listeners}>
          {handleNode ? handleNode : <MenuOutlined />}
        </div>
      )}
    </div>
  );
}
