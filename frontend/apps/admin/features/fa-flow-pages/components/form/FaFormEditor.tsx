import { closestCenter, DndContext, DragEndEvent, KeyboardSensor, PointerSensor, pointerWithin, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { findIndex } from 'lodash';
import { FaFormSortList } from './base-drag';
import { Draggable } from './components/Draggable';
import { Droppable } from './components/Droppable';
import RowContainer from './components/RowContainer';
import { useFaFormStore } from './stores/useFaFormStore';
import { useEffect } from 'react';
import { FaFlexRestLayout } from '@fa/ui';
import { Button } from 'antd';
import FaFormShowModal from './modal/FaFormShowModal';
import { Flow } from '@/types';
import FormItemPanel from './panel/FormItemPanel';


const DROPPABLE_ID = 'form-canvas-area';

export interface FaFormEditorProps {
  config?: Flow.FlowFormConfig;
  onChange?: (config: Flow.FlowFormConfig) => void;
  onClickItem?: (item: Flow.FlowFormItem) => void;
}

/**
 * FA-表单设计器
 * @author xu.pengfei
 * @date 2025-12-16 16:38:38
 */
export default function FaFormEditor({ config, onChange, onClickItem }: FaFormEditorProps) {
  const formItems = useFaFormStore((state) => state.formItems);
  const initialized = useFaFormStore((state) => state.initialized);
  const initConfig = useFaFormStore((state) => state.initConfig);
  const reorderFormItems = useFaFormStore((state) => state.reorderFormItems);
  const reorderRowChildren = useFaFormStore((state) => state.reorderRowChildren);
  const moveChildBetweenRows = useFaFormStore((state) => state.moveChildBetweenRows);
  const moveChildFromRowToForm = useFaFormStore((state) => state.moveChildFromRowToForm);
  const moveFormItemToRow = useFaFormStore((state) => state.moveFormItemToRow);
  const addFormItem = useFaFormStore((state) => state.addFormItem);
  const addChildToRow = useFaFormStore((state) => state.addChildToRow);
  const clearFormItems = useFaFormStore((state) => state.clearFormItems);

  const selectedFormItem = useFaFormStore((state) => state.selectedFormItem);
  const setSelectedFormItem = useFaFormStore((state) => state.setSelectedFormItem);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10, // 移动 10px 才启动拖动
        // 或 delay: 200, // 长按 200ms 才启动（可结合 tolerance）
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // 初始化 store 和清理
  useEffect(() => {
    console.log('FaFormEditor mounted', config);
    initConfig(config);
    return () => {
      console.log('FaFormEditor unmounted, clearing form items');
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
    if (!initialized) {
      return;
    }
    onChange?.({ formItems });
  }, [formItems, initialized]);

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

  function handleClickItem(item: Flow.FlowFormItem) {
    console.log('点击表单项', item);
    setSelectedFormItem(item);
    onClickItem?.(item);
  }

  return (
    <DndContext
      sensors={sensors}
      // collisionDetection={closestCenter} // 比较中心点距离，选择最近的
      collisionDetection={pointerWithin} // 指针（鼠标/手指）是否在目标内
      onDragEnd={handleDragEnd}
    >
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

        {/* right  */}
        <div style={{ flex: 1, position: 'relative' }} className='fa-flex-column'>
          {/* toolbar */}
          <div style={{ height: 40 }} className='fa-border-b fa-flex-row-center'>
            toolbar
            {config && (
              <FaFormShowModal title="预览表单" config={config}>
                <Button size="small">预览</Button>
              </FaFormShowModal>
            )}
          </div>

          {/* form canvas */}
          <FaFlexRestLayout>
            <Droppable className='fa-full-content' id={DROPPABLE_ID}>
              <div className='fa-full-content' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: 500 }}>
                  <FaFormSortList
                    list={formItems}
                    renderItem={(i) => {
                      if (i.type === 'input') {
                        return (
                          <div>
                            这是一个输入框 - {i.id} - {i.name}
                          </div>
                        );
                      } else if (i.type === 'row') {
                        return (
                          <div style={{ width: '100%' }}>
                            <RowContainer row={i} onClickRowItem={handleClickItem} />
                          </div>
                        );
                      } else {
                        return (
                          <div>
                            未知组件 - {i.id}
                          </div>
                        );
                      }
                    }}
                    // handle
                    // onSortEnd={(l) => reorderFormItems(l)}
                    itemStyle={{
                      padding: 8,
                      borderBottom: '1px solid #ccc',
                      width: '100%',
                    }}
                    containerStyle={{}}
                    type='vertical'
                    vertical
                    onClickItem={(item) => {
                      handleClickItem(item)
                    }}
                  />
                </div>
              </div>
            </Droppable>
          </FaFlexRestLayout>
        </div>

        <div style={{ width: 300 }} className='fa-border-l'>
          <h1>表单属性</h1>

          <FormItemPanel />
        </div>
      </div>
    </DndContext>
  );
}
