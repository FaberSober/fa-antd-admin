import React, { CSSProperties, ReactNode } from 'react';
import { useDraggable } from '@dnd-kit/core';
import './index.css';

export interface FaDraggableProps {
  disabled?: boolean; // 是否禁用拖动
  children?: ReactNode;
  style?: CSSProperties;
  handle?: boolean;
  handleNode?: ReactNode;
  handleStyle?: CSSProperties;
}

/**
 * @author xu.pengfei
 * @date 2022/12/3 9:44
 */
export default function FaDraggable({ disabled, handle, handleNode, children, style, handleStyle }: FaDraggableProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: 'draggable',
  });
  const styleTrans = transform
    ? {
        // display: 'inline-block',
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : {};

  let rootListeners = listeners;
  if (disabled || handle) {
    rootListeners = {};
  }

  return (
    <div ref={setNodeRef} style={{ ...styleTrans, ...style }} {...rootListeners} {...attributes}>
      {children}
      {handle && (
        <div id="drag-handle" className="fa-drag-handle" style={handleStyle} {...listeners}>
          {handleNode}
        </div>
      )}
    </div>
  );
}
