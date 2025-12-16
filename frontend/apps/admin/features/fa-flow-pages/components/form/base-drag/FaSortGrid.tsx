import React, { CSSProperties, ReactNode, useState } from 'react';
import { findIndex, get } from 'lodash';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import FaSortItem from './FaSortItem';
import { GridContainer } from './GridContainer';

export interface FaSortGridProps<T> {
  list: T[];
  rowKey?: string; // T对象的ID属性，默认值：id
  renderItem: (item: T) => ReactNode;
  onSortEnd?: (list: T[]) => void;
  handle?: boolean; // 是否使用拖动把手
  handleNode?: ReactNode;
  itemStyle?: CSSProperties;
  itemClassName?: string|undefined;
  handleStyle?: CSSProperties;
  gridStyle?: CSSProperties;
  columns?: number; // grid columns
}

/**
 * sort grid using @dnd-kit
 * @author xu.pengfei
 * @date 2022/12/14 21:52
 */
export default function FaSortGrid<T>({
  list,
  rowKey = 'id',
  renderItem,
  onSortEnd,
  handle,
  handleNode,
  itemStyle,
  itemClassName,
  handleStyle,
  gridStyle,
  columns,
}: FaSortGridProps<T>) {
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: any) {
    setActiveId(null);
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = findIndex(list, (i) => getRowKey(i) === active.id);
      const newIndex = findIndex(list, (i) => getRowKey(i) === over.id);

      const newList = arrayMove(list, oldIndex, newIndex);
      if (onSortEnd) onSortEnd(newList);
    }
  }

  function getRowKey(item: T) {
    return get(item, rowKey!);
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={({ active }) => {
        if (!active) return;
        setActiveId(active.id);
      }}
      onDragCancel={() => setActiveId(null)}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={list.map((i) => getRowKey(i))}>
        <GridContainer style={gridStyle} columns={columns || 5}>
          {list.map((i) => (
            <FaSortItem
              key={getRowKey(i)}
              id={getRowKey(i)}
              style={itemStyle}
              className={itemClassName}
              handle={handle}
              handleNode={handleNode}
              handleStyle={handleStyle}
              dragging={activeId === getRowKey(i)}
            >
              {renderItem(i)}
            </FaSortItem>
          ))}
        </GridContainer>
      </SortableContext>
    </DndContext>
  );
}
