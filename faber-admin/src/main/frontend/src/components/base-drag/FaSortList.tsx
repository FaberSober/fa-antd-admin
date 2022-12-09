import React, {CSSProperties, ReactNode, useState} from 'react';
import {closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {findIndex, get} from 'lodash';
import FaSortItem from "./FaSortItem";


export interface FaSortListProps<T> {
  list: T[];
  rowKey?: string; // T对象的ID属性，默认值：id
  renderItem: (item: T) => ReactNode;
  onSortEnd?: (list: T[]) => void;
  handle?: boolean; // 是否使用拖动把手
  itemStyle?: CSSProperties;
  vertical?: boolean;
}

/**
 * 封装的排序列表
 * @author xu.pengfei
 * @date 2022/12/3 9:57
 */
export default function FaSortList<T>({ list, rowKey = 'id', renderItem, onSortEnd, handle, itemStyle, vertical }: FaSortListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event:any) {
    const {active, over} = event;

    if (active.id !== over.id) {
      const oldIndex = findIndex(list, (i) => getRowKey(i) === active.id);
      const newIndex = findIndex(list, (i) => getRowKey(i) === over.id);

      const newList = arrayMove(list, oldIndex, newIndex);
      if (onSortEnd) {
        onSortEnd(newList)
      }
    }
  }

  function getRowKey(item: T) {
    return get(item, rowKey!)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={list.map(i => getRowKey(i))}
        strategy={verticalListSortingStrategy}
      >
        {list.map(i => (
          <FaSortItem key={getRowKey(i)} id={getRowKey(i)} handle={handle} vertical={vertical} style={itemStyle}>
            {renderItem(i)}
          </FaSortItem>
        ))}
      </SortableContext>
    </DndContext>
  );
}
