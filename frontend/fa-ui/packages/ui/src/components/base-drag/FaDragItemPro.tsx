import { DndContext } from '@dnd-kit/core';
import FaDraggable, { FaDraggableProps } from './FaDraggable';

export interface FaDragItemProProps extends FaDraggableProps {
  onDrag?: (dx: number, dy: number) => void;
}

/**
 * 可拖动的Item
 * @author xu.pengfei
 * @date 2022/12/3 11:01
 */
export default function FaDragItemPro({ onDrag, style, ...props }: FaDragItemProProps) {
  return (
    <DndContext
      onDragEnd={({ delta }) => {
        if (onDrag) {
          onDrag(delta.x, delta.y);
        }
      }}
    >
      <FaDraggable style={{ ...style }} {...props} />
    </DndContext>
  );
}
