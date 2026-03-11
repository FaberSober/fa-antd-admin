
import React from 'react';
import {useDroppable} from '@dnd-kit/core';

export function Droppable(props: any) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id || 'droppable',
  });
  const style = {
    background: isOver ? 'rgba(255, 255, 0, 0.1)' : undefined, // 使用透明度很低的黄色背景
    // border: isOver ? '2px dashed #007bff' : '2px solid #ccc', // 用border加强视觉反馈
    boxShadow: isOver ? 'inset 0 0 8px rgba(0, 123, 255, 0.2)' : 'none', // 内阴影效果
    transition: 'all 0.2s ease',
    ...props.style,
  };

  return (
    <div ref={setNodeRef} style={style} className={props.className}>
      {props.children}
    </div>
  );
}
