import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { findIndex } from 'lodash';
import { FaSortList } from './base-drag';
import { Draggable } from './components/Draggable';
import { Droppable } from './components/Droppable';
import RowContainer from './components/RowContainer';
import { useFaFormStore } from './stores/useFaFormStore';
import { useEffect, useRef } from 'react';


const DROPPABLE_ID = 'form-canvas-area';

export interface FaFormEditorProps {
  config?: any;
  onChange?: (config: any) => void;
}

/**
 * FA-表单设计器
 * @author xu.pengfei
 * @date 2025-12-16 16:38:38
 */
export default function FaFormEditor({ config, onChange }: FaFormEditorProps) {
  const formItems = useFaFormStore((state) => state.formItems);
  const reorderFormItems = useFaFormStore((state) => state.reorderFormItems);
  const reorderRowChildren = useFaFormStore((state) => state.reorderRowChildren);
  const moveChildBetweenRows = useFaFormStore((state) => state.moveChildBetweenRows);
  const moveChildFromRowToForm = useFaFormStore((state) => state.moveChildFromRowToForm);
  const moveFormItemToRow = useFaFormStore((state) => state.moveFormItemToRow);
  const addFormItem = useFaFormStore((state) => state.addFormItem);
  const addChildToRow = useFaFormStore((state) => state.addChildToRow);
  const clearFormItems = useFaFormStore((state) => state.clearFormItems);

  // 初始化 store 和清理
  useEffect(() => {
    return () => {
      clearFormItems();
    };
  }, []);

  useEffect(() => {
    console.log('config changed:', config);
    const formItems = config?.formItems || [];
    reorderFormItems(formItems);
  }, [config]);

  useEffect(() => {
    console.log('formItems changed:', formItems);
    onChange?.({ formItems });
  }, [formItems, onChange]);

  function handleDragEnd(event: DragEndEvent) {
    console.log('拖拽结束', event);
    const { active, over } = event;

    if (!active || !over) {
      return;
    }

    const activeType = (active.data.current as any)?.type;
    const overType = (over.data.current as any)?.type;

    // 拖动到画布上
    if (over.id === DROPPABLE_ID) {
      // 处理RowItem拖到主表单画布
      if (activeType === 'RowItem') {
        const activeId = String(active.id);
        const sourceRowId = (active.data.current as any)?.rowId;
        const overId = String(over.id);

        // 拖动到主表单画布
        if (overId === DROPPABLE_ID && sourceRowId) {
          moveChildFromRowToForm(sourceRowId, activeId);
          return;
        }
      }

      if (active.id === 'input') {
        addFormItem('input');
      } else if (active.id === 'row') {
        addFormItem('row');
      }
      return;
    }

    // 处理RowItem拖到另一个RowContainer中
    if (activeType === 'RowItem') {
      const activeId = String(active.id);

      // 查找源行（包含被拖动的子项的行）
      const sourceRow = formItems.find((item) =>
        item.type === 'row' && item.children?.some((child) => child.id === activeId)
      );

      // 检查是否拖到了一个RowContainer（droppable-row-xxx）
      const overId = String(over.id);
      if (overId.startsWith('droppable-row-')) {
        const targetRowId = overId.replace('droppable-row-', '');

        // 只有当源行和目标行不同时，才执行跨行移动
        if (sourceRow && sourceRow.id !== targetRowId) {
          moveChildBetweenRows(sourceRow.id, targetRowId, activeId);
          return;
        }
      }

      // 处理RowContainer内的子项排序（同一行内）
      if (activeType === 'RowItem' && overType === 'RowItem') {
        const overId = String(over.id);

        if (sourceRow && sourceRow.children) {
          const activeIndex = findIndex(sourceRow.children, { id: activeId });
          const overIndex = findIndex(sourceRow.children, { id: overId });

          if (activeIndex !== -1 && overIndex !== -1) {
            const newChildren = arrayMove(sourceRow.children, activeIndex, overIndex);
            reorderRowChildren(sourceRow.id, newChildren);
          }
        }
        return;
      }
    }

    // 拖动到行容器中
    const rowContainerId = String(over.id);
    if (rowContainerId.startsWith('droppable-row-')) {
      const rowId = rowContainerId.replace('droppable-row-', '');

      // 处理从主表单拖动项目到行容器
      const activeId = String(active.id);
      const isFormItem = formItems.some((item) => item.id === activeId);
      if (isFormItem && activeType !== 'RowItem') {
        moveFormItemToRow(activeId, rowId);
        return;
      }

      if (active.id === 'input') {
        addChildToRow(rowId, 'input');
      } else if (active.id === 'row') {
        addChildToRow(rowId, 'row');
      }
      return;
    }

    // 重新排序顶级表单项
    if (active.id !== over.id) {
      const activeId = String(active.id);
      const overId = String(over.id);
      const activeIndex = findIndex(formItems, { id: activeId });
      const overIndex = findIndex(formItems, { id: overId });

      if (activeIndex !== -1 && overIndex !== -1) {
        // 顶级项排序
        const newItems = arrayMove(formItems, activeIndex, overIndex);
        reorderFormItems(newItems);
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className='fa-full fa-flex-row'>
        <div style={{ width: 300, borderRight: '1px solid #ccc'}} className='fa-flex-column'>
          <h1>表单组件</h1>

          <div>
            <Draggable id="input">
              <div>Input</div>
            </Draggable>
            <Draggable id="row">
              <div>Row</div>
            </Draggable>
          </div>
        </div>

        {/* right droppable  */}
        <div style={{ flex: 1, position: 'relative' }}>
          <Droppable className='fa-full-content' id={DROPPABLE_ID}>
            <div className='fa-full-content' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ width: 500 }}>
                <FaSortList
                  list={formItems}
                  renderItem={(i) => {
                    if (i.type === 'input') {
                      return <div>这是一个输入框 - {i.id}</div>;
                    } else if (i.type === 'row') {
                      return <RowContainer row={i} />;
                    } else {
                      return <div>未知组件 - {i.id}</div>;
                    }
                  }}
                  // onSortEnd={(l) => reorderFormItems(l)}
                  itemStyle={{
                    padding: 8,
                    borderBottom: '1px solid #ccc',
                    width: '100%',
                  }}
                  containerStyle={{}}
                  type='vertical'
                  vertical
                />
              </div>
            </div>
          </Droppable>
        </div>
      </div>
    </DndContext>
  );
}
