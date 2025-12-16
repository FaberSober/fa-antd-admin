import React from 'react';
import {useDraggable} from '@dnd-kit/core';

export function Draggable(props:any) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id || 'draggable',
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 999,
  } : {};


  return (
    <button ref={setNodeRef} style={{ ...style, ...props.style }} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
