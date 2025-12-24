import { FaGridLayout } from '@/components';
import { Flow } from '@/types';
import { DndContext, DragEndEvent, KeyboardSensor, PointerSensor, pointerWithin, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { FaFlexRestLayout, FaUtils } from '@fa/ui';
import { Button, Form, Popconfirm, Space } from 'antd';
import clsx from 'clsx';
import { findIndex } from 'lodash';
import { useEffect } from 'react';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import FaFormShowModal from '../formShow/modal/FaFormShowModal';
import { FaFormSortList } from './base-drag';
import { Draggable } from './components/Draggable';
import { Droppable } from './components/Droppable';
import FaFormEditorItem from './cube/FaFormEditorItem';
import './index.scss';
import FormItemPanel from './panel/FormItemPanel';
import { useFaFormStore } from './stores/useFaFormStore';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import React from 'react';
import { Layout } from 'react-grid-layout';


const DROPPABLE_ID = 'form-canvas-area';

export interface FaFormEditorProps {
  flowForm: Flow.FlowForm;
  config?: Flow.FlowFormConfig;
  onChange?: (config: Flow.FlowFormConfig) => void;
  onClickItem?: (item: Flow.FlowFormItem) => void;
}

/**
 * FA-表单设计器
 * @author xu.pengfei
 * @date 2025-12-16 16:38:38
 */
export default function FaFormEditor({ flowForm, config, onChange, onClickItem }: FaFormEditorProps) {
  const layout = useFaFormStore((state) => state.layout);
  const formItemMap = useFaFormStore((state) => state.formItemMap);
  const formItems = useFaFormStore((state) => state.formItems);
  const initialized = useFaFormStore((state) => state.initialized);
  const init = useFaFormStore((state) => state.init);

  const addFormItem = useFaFormStore((state) => state.addFormItem);
  const setLayout = useFaFormStore((state) => state.setLayout);

  const reorderFormItems = useFaFormStore((state) => state.reorderFormItems);
  const reorderRowChildren = useFaFormStore((state) => state.reorderRowChildren);
  const moveChildBetweenRows = useFaFormStore((state) => state.moveChildBetweenRows);
  const moveChildFromRowToForm = useFaFormStore((state) => state.moveChildFromRowToForm);
  const moveFormItemToRow = useFaFormStore((state) => state.moveFormItemToRow);
  const removeFormItem = useFaFormStore((state) => state.removeFormItem);
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
    console.log('FaFormEditor mounted', flowForm);
    init(flowForm);
    return () => {
      console.log('FaFormEditor unmounted, clearing form items');
      clearFormItems();
    };
  }, []);

  useEffect(() => {
    console.log('config changed:', config);
  }, [config]);

  useEffect(() => {
    console.log('layout changed:', layout, formItemMap);
    if (!initialized) {
      return;
    }
    onChange?.({
      formConfig: {
        name: '',
        description: '',
      },
      layout,
      formItemMap,
    });
  }, [layout, formItemMap, initialized]);

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

  function handleDeleteFormItem(item: Flow.FlowFormItem) {
    console.log('删除表单项', item);
    // 如果删除的项是已选中的项，则清除选择
    if (selectedFormItem?.id === item.id) {
      setSelectedFormItem(undefined);
    }
    removeFormItem(item.id);
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

          <div className='fa-flex-row fa-flex-wrap fa-gap12'>
            {/* <div id="input" className='fa-normal-btn'>
              <div>Input</div>
            </div>
            <div id="row" className='fa-normal-btn'>
              <div>Row</div>
            </div> */}

            {['input', 'select', 'datepicker', 'textarea', 'row'].map((type) => (
              <div
                key={type}
                draggable
                unselectable="on"
                onDragStart={(e) => {
                  e.dataTransfer.setData('text/plain', type); // 携带字段类型
                }}
                style={{
                  padding: 12,
                  marginBottom: 8,
                  background: '#fff',
                  border: '1px solid #d9d9d9',
                  cursor: 'move',
                  userSelect: 'none',
                }}
              >
                {type}
              </div>
            ))}
          </div>
        </div>

        {/* right  */}
        <div style={{ flex: 1, position: 'relative' }} className='fa-flex-column'>
          {/* toolbar */}
          <div style={{ height: 40 }} className='fa-border-b fa-flex-row-center'>
            toolbar
            {config && (
              <Space>
                <FaFormShowModal title="预览表单" config={config}>
                  <Button size="small">预览</Button>
                </FaFormShowModal>
                <Popconfirm title="确定要清空表单吗？" onConfirm={() => clearFormItems()}>
                  <Button size="small" danger>清空</Button>
                </Popconfirm>
              </Space>
            )}
          </div>

          {/* form canvas */}
          <FaFlexRestLayout>
            <Form>
              {/* <Droppable className='fa-full-content' id={DROPPABLE_ID}> */}
                <div className='fa-full-content' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <FaGridLayout
                    containerStyle={{ width: '100%', height: '100%', position: 'relative', background: 'var(--fa-bg-color)' }}
                    style={{height: '100%'}}
                    layout={layout}
                    renderItem={(i) => {
                      const formItem = formItemMap[i.i];
                      if (formItem) {
                        const selected = formItem.id === selectedFormItem?.id;
                        return (
                          <div
                            className={clsx('fa-form-editor-item', selected && 'fa-form-editor-item-selected')}
                            style={{ width: '100%' }}
                            onClick={(e) => {
                              FaUtils.preventEvent(e);
                              handleClickItem(formItem);
                            }}
                          >
                            <FaFormEditorItem formItem={formItem} />

                            {selected && (
                              <Space style={{ position: 'absolute', top: -12, right: 10, zIndex: 999 }}>
                                <Button size='small' onClick={(e) => {
                                  FaUtils.preventEvent(e);
                                }} shape="circle" icon={<CopyOutlined />} color="primary" variant="outlined" />
                                <Button size='small' onClick={(e) => {
                                  FaUtils.preventEvent(e);
                                  handleDeleteFormItem(formItem);
                                }} shape="circle" icon={<DeleteOutlined />} danger />
                              </Space>
                            )}
                          </div>
                        );
                      }
                      return (
                        <div className='fa-form-editor-item'>
                          {i.i} Not Found
                        </div>
                      );
                    }}
                    onLayoutChange={(layout) => {
                      console.log('布局变化：', layout);
                      // 如果有 __dropping__ 占位符，则不更新
                      if (layout.some((item) => item.i === '__dropping__')) {
                        return;
                      }
                      setLayout(layout);
                    }}
                    gridConfig={{
                      cols: 24,
                      rowHeight: 50,
                      margin: [12, 12],
                      containerPadding: [12, 12],
                    }}
                    dropConfig={{
                      enabled: true,
                      defaultItem: { w: 24, h: 1 }, // Default size (default: { w: 1, h: 1 })
                      onDragOver: (e: DragEvent) => {
                        console.log('拖拽悬停：', e);
                      },
                    }}
                    droppingItem={{ i: '__dropping__', w: 24, h: 1, x: 0, y: 0 }} // 拖入时的占位大小
                    onDrop={(layout, item, e: Event) => {
                      // e.dataTransfer 可携带自定义数据（如字段类型）
                      const fieldType:any = e.dataTransfer?.getData('text/plain') || '未知字段';
                      console.log('放下项目：', layout, item, fieldType);
                      setTimeout(() => {
                        addFormItem(fieldType, item!, layout);
                      }, 10)

                      // const newItem: LayoutItem = {
                      //   i: `item-${nextId}`,        // 唯一 key
                      //   x: layoutItem.x,
                      //   y: layoutItem.y,
                      //   w: 12,                      // 默认占 12 格（半行）
                      //   h: 2,                       // 高度，可根据需求调整
                      // };

                      // setLayout([...layout, newItem]);
                      // setNextId(nextId + 1);

                      // console.log('新增字段:', fieldType, newItem);
                      // 这里可将 layout 保存到后端（SpringBoot + MyBatisPlus 存 JSON）
                    }}
                    isDraggable
                    isResizable
                  />

                  {/* <div className='fa-flex-column' style={{ justifyContent: 'center' }}> */}
                    {/* <FaFormSortList
                      list={formItems}
                      renderItem={(i) => {
                        const selected = i.id === selectedFormItem?.id;
                        return (
                          <div className={clsx('fa-form-editor-item', selected && 'fa-form-editor-item-selected')} style={{ width: '100%' }}>
                            <FaFormEditorItem formItem={i} onClickRowItem={handleClickItem} />

                            {selected && (
                              <Space style={{ position: 'absolute', top: -10, right: 10, zIndex: 999 }}>
                                <Button danger size='small' onClick={(e) => {
                                  FaUtils.preventEvent(e);
                                  handleDeleteFormItem(i);
                                }}>删除</Button>
                              </Space>
                            )}
                          </div>
                        );
                      }}
                      // handle
                      // onSortEnd={(l) => reorderFormItems(l)}
                      itemStyle={{
                        // padding: 8,
                        // borderBottom: '1px solid #ccc',
                        width: '100%',
                      }}
                      containerStyle={{}}
                      type='vertical'
                      vertical
                      onClickItem={(item) => {
                        handleClickItem(item)
                      }}
                    /> */}
                  {/* </div> */}
                </div>
              {/* </Droppable> */}
            </Form>
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
