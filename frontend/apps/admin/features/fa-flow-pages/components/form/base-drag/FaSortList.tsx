import React, { CSSProperties, ReactNode } from 'react';
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { findIndex, get } from 'lodash';
import FaSortItem from './FaSortItem';
import {Empty} from "antd";

export interface FaSortListProps<T> {
  list: T[];
  rowKey?: string; // T对象的ID属性，默认值：id
  renderItem: (item: T, index: number) => ReactNode;
  onSortEnd?: (list: T[], oldIndex: number, newIndex: number) => void;
  handle?: boolean; // 是否使用拖动把手
  handleNode?: ReactNode;
  itemStyle?: CSSProperties;
  handleStyle?: CSSProperties;
  /** 滚动容器样式 */
  containerStyle?: CSSProperties;
  type?: 'vertical' | 'horizontal';
  /** true-只变更x坐标，固定y坐标 */
  vertical?: boolean;
  /** true-只变更y坐标，固定x坐标 */
  horizontal?: boolean;
}

/**
 * 封装的排序列表
 * @author xu.pengfei
 * @date 2022/12/3 9:57
 */
export default function FaSortList<T>({
  list,
  rowKey = 'id',
  renderItem,
  onSortEnd,
  handle,
  handleNode,
  itemStyle,
  handleStyle,
  containerStyle,
  type = 'vertical',
  vertical,
  horizontal,
}: FaSortListProps<T>) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = findIndex(list, (i) => getRowKey(i) === active.id);
      const newIndex = findIndex(list, (i) => getRowKey(i) === over.id);

      // const moveItems = [list[oldIndex], list[newIndex]]
      const newList = arrayMove(list, oldIndex, newIndex);
      if (onSortEnd) {
        onSortEnd(newList, oldIndex, newIndex);
      }
    }
  }

  function getRowKey(item: T) {
    return get(item, rowKey!);
  }

  const defaultContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: type === 'vertical' ? 'column' : 'row',
    ...containerStyle,
  };

  if (list === undefined || list === null || list.length === 0) {
    return <Empty />
  }

  return (
    // <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={list.map((i) => getRowKey(i))} strategy={type === 'vertical' ? verticalListSortingStrategy : horizontalListSortingStrategy}>
        <div style={defaultContainerStyle}>
          {list.map((item, index) => (
            <FaSortItem
              key={getRowKey(item)}
              id={getRowKey(item)}
              handle={handle}
              handleNode={handleNode}
              vertical={vertical}
              horizontal={horizontal}
              style={itemStyle}
              handleStyle={handleStyle}
            >
              {renderItem(item, index)}
            </FaSortItem>
          ))}
        </div>
      </SortableContext>
    // </DndContext>
  );
}
