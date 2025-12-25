import { FaGridLayout } from '@/components';
import { Flow } from '@/types';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaUtils } from '@fa/ui';
import { Button, Form, Popconfirm, Space } from 'antd';
import clsx from 'clsx';
import { useEffect, useMemo } from 'react';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import FaFormShowModal from '../formShow/modal/FaFormShowModal';
import FaFormEditorItem from './cube/FaFormEditorItem';
import './index.scss';
import FormItemPanel from './panel/FormItemPanel';
import { useFaFormStore } from './stores/useFaFormStore';


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
export default function FaFormEditor({ flowForm, config:outConfig, onChange, onClickItem }: FaFormEditorProps) {
  // const layout = useFaFormStore((state) => state.layout);
  // const formItemMap = useFaFormStore((state) => state.formItemMap);
  const config = useFaFormStore((state) => state.config);
  const initialized = useFaFormStore((state) => state.initialized);
  const init = useFaFormStore((state) => state.init);

  const addFormItem = useFaFormStore((state) => state.addFormItem);
  const removeFormItem = useFaFormStore((state) => state.removeFormItem);
  const clearFormItems = useFaFormStore((state) => state.clearFormItems);

  const setLayout = useFaFormStore((state) => state.setLayout);

  const selectedFormItem = useFaFormStore((state) => state.selectedFormItem);
  const setSelectedFormItem = useFaFormStore((state) => state.setSelectedFormItem);

  const layout = useMemo(() => {
    return config?.layout || [];
  }, [config]);
  const formItemMap = useMemo(() => {
    return config?.formItemMap || {};
  }, [config]);

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
    console.log('outConfig changed:', outConfig);
  }, [outConfig]);

  useEffect(() => {
    console.log('config changed:', config);
    if (!initialized) {
      return;
    }
    onChange?.(config);
  }, [config, initialized]);

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
    <div className='fa-full fa-flex-row'>
      <div style={{ width: 300, borderRight: '1px solid #ccc'}} className='fa-flex-column'>
        <h1>表单组件</h1>

        <div className='fa-flex-row fa-flex-wrap fa-gap12'>
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
                onDrop={(layout, item, e) => {
                  // e.dataTransfer 可携带自定义数据（如字段类型）
                  const fieldType:any = e.dataTransfer?.getData('text/plain') || '未知字段';
                  console.log('放下项目：', layout, item, fieldType);
                  setTimeout(() => {
                    addFormItem(fieldType, item!, layout);
                  }, 10)
                }}
                isDraggable
                isResizable
              />
            </div>
          </Form>
        </FaFlexRestLayout>
      </div>

      <div style={{ width: 300 }} className='fa-border-l'>
        <h1>表单属性</h1>

        <FormItemPanel />
      </div>
    </div>
  );
}
