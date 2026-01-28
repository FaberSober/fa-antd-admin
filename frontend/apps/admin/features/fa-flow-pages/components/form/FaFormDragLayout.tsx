import { Flow } from '@features/fa-flow-pages/types';
import { Col, Row } from 'antd';
import React, { useState } from 'react';
import FaFormEditorItem from './cube/FaFormEditorItem';

export interface FaFormDragLayoutProps {
  /** 表单布局 */
  items: Flow.FlowFormItem[];
  onChange?: (items: Flow.FlowFormItem[]) => void;
}

/**
 * @author xu.pengfei
 * @date 2026-01-27 20:47:30
 */
export default function FaFormDragLayout({ items, onChange }: FaFormDragLayoutProps) {
  // 拖拽状态管理
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // 生成唯一 ID
  const generateId = () => {
    return `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // 拖动开始
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('internalDrag', 'true');
  };

  // 拖动经过
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault(); // 必须阻止默认行为才能触发 drop 事件

    // 如果是外部拖入(draggedIndex 为 null 表示不是内部拖拽)
    if (draggedIndex === null) {
      setDragOverIndex(index);
      return;
    }

    if (draggedIndex === index) {
      setDragOverIndex(index);
      return;
    }

    // 获取目标节点的位置信息
    const targetElement = e.currentTarget;
    const rect = targetElement.getBoundingClientRect();

    // 计算鼠标相对于目标节点的垂直位置
    const mouseY = e.clientY;
    const targetCenterY = rect.top + rect.height / 2;

    // 判断鼠标在中心点上方还是下方
    const isAboveCenter = mouseY < targetCenterY;

    // 创建新的配置数组
    const newConfig = [...items];
    const draggedItem = newConfig[draggedIndex];

    // 移除被拖动的元素
    newConfig.splice(draggedIndex, 1);

    // 根据鼠标位置决定插入位置
    let insertIndex = index;
    if (draggedIndex < index) {
      // 从前往后拖:如果在中心点上方,插入到 index-1;否则插入到 index
      insertIndex = isAboveCenter ? index - 1 : index;
    } else {
      // 从后往前拖:如果在中心点上方,插入到 index;否则插入到 index+1
      insertIndex = isAboveCenter ? index : index + 1;
    }

    // 在目标位置插入
    newConfig.splice(insertIndex, 0, draggedItem);

    // 调用 onChange 回调
    onChange?.(newConfig);

    // 更新拖动索引,因为数组已经变化
    setDraggedIndex(insertIndex);
    setDragOverIndex(index);
  };

  // 放置
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    e.stopPropagation();

    const componentType = e.dataTransfer.getData('componentType');

    // 如果是从外部拖入新组件(draggedIndex 为 null 表示不是内部拖拽)
    if (componentType && draggedIndex === null) {
      const newItem: Flow.FlowFormItem = {
        id: generateId(),
        type: componentType as Flow.FlowFormItemType,
        md: componentType === 'row' ? 24 : 12,
        children: componentType === 'row' ? [] : undefined,
      };

      const newConfig = [...items];
      newConfig.splice(index + 1, 0, newItem);

      onChange?.(newConfig);
    }
    // 内部拖拽排序已经在 dragOver 中处理
  };

  // 拖动结束
  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <Row gutter={0} style={{ padding: 12, minHeight: 40 }}>
      {items.map((item, index) => {
        const isDragging = draggedIndex === index;
        const isDragOver = dragOverIndex === index && draggedIndex !== index;

        return (
          <Col
            key={item.id}
            span={item.md || 12}
            style={{
              padding: 6,
              opacity: isDragging ? 0.5 : 1,
              transition: 'opacity 0.2s',
            }}
            className={`fa-form-editor-col ${isDragging ? 'dragging' : ''} ${isDragOver ? 'drag-over' : ''}`}
          >
            <div
              style={{
                border: isDragOver ? '2px solid #1890ff' : '1px dashed #ccc',
                padding: 6,
                cursor: 'move',
                backgroundColor: isDragOver ? '#e6f7ff' : 'transparent',
                transition: 'all 0.2s',
              }}
              draggable
              onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, index)}
              onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e, index)}
              onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              {item.type === 'row' && (
                <FaFormDragLayout
                  items={item.children || []}
                  onChange={(children: Flow.FlowFormItem[]) => {
                    const newItems = [...items];
                    newItems[index] = { ...item, children };
                    onChange?.(newItems);
                  }}
                />
              )}
              {item.type !== 'row' && <FaFormEditorItem formItem={item} />}
            </div>
          </Col>
        );
      })}
    </Row>
  );
}