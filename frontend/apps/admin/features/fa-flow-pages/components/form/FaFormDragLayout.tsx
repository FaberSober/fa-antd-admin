import { Flow } from '@features/fa-flow-pages/types';
import { Col, Row } from 'antd';
import React from 'react';
import FaFormEditorItem from './cube/FaFormEditorItem';
import { FaUtils } from '@fa/ui';
import { useFaFormStore } from './stores/useFaFormStore';
import { findFormItemById, removeFormItemById } from './utils';

export interface FaFormDragLayoutProps {
  parentId?: string;
  /** 表单布局 */
  items: Flow.FlowFormItem[];
  onChange?: (items: Flow.FlowFormItem[]) => void;
  header?: React.ReactNode;
  /** 是否是根节点 */
  root?: boolean;
  /** 是否允许拖入 */
  allowIn?: boolean;
  /** 是否允许拖出 */
  allowOut?: boolean;
}

/**
 * @author xu.pengfei
 * @date 2026-01-27 20:47:30
 */
export default function FaFormDragLayout({ parentId, items, onChange, header, root = false, allowIn = false, allowOut = false }: FaFormDragLayoutProps) {
  // 从 store 中获取拖拽状态
  const draggedId = useFaFormStore((state) => state.draggedId);
  const dragOverId = useFaFormStore((state) => state.dragOverId);
  const setDraggedId = useFaFormStore((state) => state.setDraggedId);
  const setDragOverId = useFaFormStore((state) => state.setDragOverId);
  // 从 store 中获取选中状态
  const selectedItemId = useFaFormStore((state) => state.selectedItemId);
  const setSelectedItemId = useFaFormStore((state) => state.setSelectedItemId);
  // 从 store 中获取 drop 处理标记
  const isDropHandling = useFaFormStore((state) => state.isDropHandling);
  const setIsDropHandling = useFaFormStore((state) => state.setIsDropHandling);
  // 获取全局 config 用于查找跳过层级的项
  const config = useFaFormStore((state) => state.config);
  const updateFormItems = useFaFormStore((state) => state.updateFormItems);

  // 生成唯一 ID
  const generateId = (type: string) => {
    return `${type}-${items.length+1}-${FaUtils.generateId(4)}`;
  };

  // 处理点击事件
  const handleItemClick = (e: React.MouseEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    setSelectedItemId(id);
  };

  // 拖动开始
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    // 检查是否允许拖出
    if (!allowOut) {
      console.log('FaFormDragLayout handleDragStart - 不允许拖出', parentId || 'root');
      e.preventDefault();
      return;
    }

    e.stopPropagation();
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('internalDrag', 'true');
  };

  // 拖动经过
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault(); // 必须阻止默认行为才能触发 drop 事件
    e.stopPropagation();

    // 如果是外部拖入(draggedId 为 null 表示不是内部拖拽)
    if (draggedId === null) {
      setDragOverId(id);
      return;
    }

    // 通过 id 查找索引
    const draggedIndex = items.findIndex(item => item.id === draggedId);
    const targetIndex = items.findIndex(item => item.id === id);

    if (draggedIndex === -1 || targetIndex === -1) {
      return;
    }

    if (draggedIndex === targetIndex) {
      setDragOverId(id);
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
    let insertIndex = targetIndex;
    if (draggedIndex < targetIndex) {
      // 从前往后拖:如果在中心点上方,插入到 targetIndex-1;否则插入到 targetIndex
      insertIndex = isAboveCenter ? targetIndex - 1 : targetIndex;
    } else {
      // 从后往前拖:如果在中心点上方,插入到 targetIndex;否则插入到 targetIndex+1
      insertIndex = isAboveCenter ? targetIndex : targetIndex + 1;
    }

    // 在目标位置插入
    newConfig.splice(insertIndex, 0, draggedItem);

    // 调用 onChange 回调
    onChange?.(newConfig);

    // 更新拖动 ID,使用插入后的元素 ID
    setDraggedId(draggedItem.id);
    setDragOverId(id);
  };

  // 放置
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    e.stopPropagation();

    // 检查是否正在处理其他 drop 事件
    if (isDropHandling) {
      console.log('FaFormDragLayout handleDrop - 已有 drop 事件正在处理,跳过', parentId);
      return;
    }

    const componentType = e.dataTransfer.getData('componentType');
    console.log('FaFormDragLayout handleDrop - componentType:', componentType, 'draggedId:', draggedId, 'parentId', parentId, 'id', id);

    // 如果是从外部拖入新组件(draggedId 为 null 表示不是内部拖拽)
    if (componentType && draggedId === null) {
      // 检查是否允许拖入
      if (!allowIn) {
        console.log('FaFormDragLayout handleDrop - 不允许拖入', parentId || 'root');
        setTimeout(() => setIsDropHandling(false), 100);
        return;
      }

      const targetIndex = items.findIndex(item => item.id === id);
      if (targetIndex === -1) return;

      // 标记开始处理
      setIsDropHandling(true);

      const nextIndex = items.length + 1
      const newItem: Flow.FlowFormItem = {
        id: generateId(componentType),
        type: componentType as Flow.FlowFormItemType,
        md: componentType === 'row' ? 24 : 12,
        label: '新组件' + nextIndex,
        children: componentType === 'row' ? [] : undefined,
      };

      const newConfig = [...items];
      newConfig.splice(targetIndex + 1, 0, newItem);

      onChange?.(newConfig);

      // 延迟重置标记,给事件传播留出时间
      setTimeout(() => setIsDropHandling(false), 100);
    }
    // 如果有 draggedId,检查是否是跨层级拖拽
    else if (draggedId) {
      const draggedItemIndex = items.findIndex(item => item.id === draggedId);
      
      // 如果在当前 items 中找不到,说明是跨层级拖拽
      if (draggedItemIndex === -1) {
        console.log('FaFormDragLayout handleDrop - 检测到跨层级拖拽', draggedId);
        
        // 检查是否允许拖入
        if (!allowIn) {
          console.log('FaFormDragLayout handleDrop - 不允许跨层级拖入', parentId || 'root');
          return;
        }
        
        // 标记开始处理
        setIsDropHandling(true);

        // 从全局 config 中查找被拖拽的项
        const draggedItem = findFormItemById(config.items || [], draggedId);
        if (draggedItem) {
          const targetIndex = items.findIndex(item => item.id === id);
          if (targetIndex === -1) {
            setTimeout(() => setIsDropHandling(false), 100);
            return;
          }

          // 从全局 config 中删除原项
          const newGlobalItems = removeFormItemById(config.items || [], draggedId);
          
          // 在当前层级添加
          const newLocalItems = [...items];
          newLocalItems.splice(targetIndex + 1, 0, draggedItem);

          // 更新全局 config
          updateFormItems(newGlobalItems);
          
          // 更新当前层级(如果有 parentId,需要通过 onChange 更新父容器)
          onChange?.(newLocalItems);

          console.log('FaFormDragLayout handleDrop - 跨层级拖拽完成', {
            from: '内层容器',
            to: parentId || '根容器',
            item: draggedItem
          });
        }

        // 延迟重置标记
        setTimeout(() => setIsDropHandling(false), 100);
      }
      // 否则是同层级拖拽,已经在 dragOver 中处理
    }
  };

  // 拖动结束
  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  // 处理空容器的拖入
  const handleEmptyContainerDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const componentType = e.dataTransfer.getData('componentType');
    if (componentType) {
      setDragOverId('empty-container');
    }
  };

  const handleEmptyContainerDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // 检查是否正在处理其他 drop 事件
    if (isDropHandling) {
      console.log('FaFormDragLayout handleEmptyContainerDrop - 已有 drop 事件正在处理,跳过', parentId);
      return;
    }

    const componentType = e.dataTransfer.getData('componentType');
    console.log('FaFormDragLayout handleEmptyContainerDrop - componentType:', componentType, 'parentId', parentId);
    if (componentType) {
      // 检查是否允许拖入
      if (!allowIn) {
        console.log('FaFormDragLayout handleEmptyContainerDrop - 不允许拖入', parentId || 'root');
        setTimeout(() => setIsDropHandling(false), 100);
        return;
      }

      // 标记开始处理
      setIsDropHandling(true);

      const nextIndex = items.length + 1
      const newItem: Flow.FlowFormItem = {
        id: generateId(componentType),
        type: componentType as Flow.FlowFormItemType,
        md: componentType === 'container_row' ? 24 : 12,
        label: '新组件' + nextIndex,
        children: componentType === 'container_row' ? [] : undefined,
      };

      onChange?.([newItem]);
      setDragOverId(null);

      // 延迟重置标记,给事件传播留出时间
      setTimeout(() => setIsDropHandling(false), 100);
    }
  };

  const handleEmptyContainerDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setDragOverId(null);
  };

  // Row 拖拽处理(仅在嵌套容器中启用)
  const handleRowDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // 仅在 parentId 有值时处理
    if (!parentId) return;
    
    e.preventDefault();
    e.stopPropagation();
    const componentType = e.dataTransfer.getData('componentType');
    if (componentType) {
      setDragOverId('row-container');
    }
  };

  const handleRowDrop = (e: React.DragEvent<HTMLDivElement>) => {
    // 仅在 parentId 有值时处理
    if (!parentId) return;

    e.preventDefault();
    e.stopPropagation();

    // 检查是否正在处理其他 drop 事件
    if (isDropHandling) {
      console.log('FaFormDragLayout handleRowDrop - 已有 drop 事件正在处理,跳过', parentId);
      return;
    }

    const componentType = e.dataTransfer.getData('componentType');
    console.log('FaFormDragLayout handleRowDrop - componentType:', componentType, 'parentId', parentId);
    if (componentType) {
      // 检查是否允许拖入
      if (!allowIn) {
        console.log('FaFormDragLayout handleRowDrop - 不允许拖入', parentId || 'root');
        setTimeout(() => setIsDropHandling(false), 100);
        return;
      }

      // 标记开始处理
      setIsDropHandling(true);

      const nextIndex = items.length + 1;
      const newItem: Flow.FlowFormItem = {
        id: generateId(componentType),
        type: componentType as Flow.FlowFormItemType,
        md: componentType === 'container_row' ? 24 : 12,
        label: '新组件' + nextIndex,
        children: componentType === 'container_row' ? [] : undefined,
      };

      // 添加到末尾
      onChange?.([...items, newItem]);
      setDragOverId(null);

      // 延迟重置标记,给事件传播留出时间
      setTimeout(() => setIsDropHandling(false), 100);
    }
  };

  return (
    <Row 
      gutter={0} 
      style={{ }}
      {...(parentId ? {
        onDragOver: handleRowDragOver,
        onDrop: handleRowDrop,
      } : {})}
    >
      {header}
      {items.length === 0 ? (
        <div
          style={{
            width: '100%',
            minHeight: 60,
            border: dragOverId === 'empty-container' ? '2px solid #1890ff' : '1px dashed #ccc',
            backgroundColor: dragOverId === 'empty-container' ? '#e6f7ff' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999',
            transition: 'all 0.2s',
          }}
          onDragOver={handleEmptyContainerDragOver}
          onDrop={handleEmptyContainerDrop}
          onDragLeave={handleEmptyContainerDragLeave}
        >
          拖入组件到此处
        </div>
      ) : (
        items.map((item) => {
          const isDragging = draggedId === item.id;
          const isDragOver = dragOverId === item.id && draggedId !== item.id;
          const isSelected = selectedItemId === item.id;

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
                  border: isSelected 
                    ? '1px solid #ff9800' 
                    : isDragOver 
                    ? '1px solid #1890ff' 
                    : '1px dashed #ccc',
                  padding: 6,
                  cursor: 'move',
                  backgroundColor: isSelected 
                    ? '#fff3e0' 
                    : isDragOver 
                    ? '#e6f7ff' 
                    : 'transparent',
                  transition: 'all 0.2s',
                }}
                draggable
                onClick={(e: React.MouseEvent<HTMLDivElement>) => handleItemClick(e, item.id)}
                onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, item.id)}
                onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e, item.id)}
                onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, item.id)}
                onDragEnd={handleDragEnd}
              >
                <FaFormEditorItem formItem={item} />
              </div>
            </Col>
          );
        })
      )}
    </Row>
  );
}