import React, {CSSProperties, ReactNode} from 'react';
import {useDraggable} from "@dnd-kit/core";
import styles from "@/components/base-drag/index.module.less";
import {MenuOutlined} from "@ant-design/icons";


export interface FaDraggableProps {
  handle?: boolean;
  children?: ReactNode;
  style?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2022/12/3 9:44
 */
export default function FaDraggable(props:FaDraggableProps) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: 'draggable',
  });
  const style = transform ? {
    display: 'inline-block',
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;


  return (
    <div ref={setNodeRef} style={{  ...style, ...props.style }} {...(props.handle ? {} : listeners)} {...attributes}>
      {props.children}
      {props.handle && (
        <div className={styles.dragHandle} style={style} {...listeners}>
          <MenuOutlined />
        </div>
      )}
    </div>
  );
}
