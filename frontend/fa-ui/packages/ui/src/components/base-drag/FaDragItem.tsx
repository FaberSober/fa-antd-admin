import React, { CSSProperties, useState } from 'react';
import { DndContext } from '@dnd-kit/core';
import { Coordinates } from '@dnd-kit/utilities';
import FaDraggable, { FaDraggableProps } from './FaDraggable';

export interface FaDragItemProps extends FaDraggableProps {
  hold?: boolean; // 拖动后固定在新位置
}

/**
 * 可拖动的Item
 * @author xu.pengfei
 * @date 2022/12/3 11:01
 */
export default function FaDragItem({ hold, style, ...props }: FaDragItemProps) {
  const [{ x, y }, setCoordinates] = useState<Coordinates>({ x: 0, y: 0 });

  const styleCal: CSSProperties = hold
    ? {
        width: '100%',
        position: 'absolute',
        top: y,
        left: x,
        zIndex: 999,
      }
    : {};

  return (
    <DndContext
      onDragEnd={({ delta }) => {
        setCoordinates(({ x, y }) => {
          return {
            x: x + delta.x,
            y: y + delta.y,
          };
        });
      }}
    >
      <FaDraggable style={{ ...styleCal, ...style }} {...props} />
    </DndContext>
  );
}
