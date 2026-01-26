import { FaGridLayout } from '@/components';
import { Flow } from '@/types';
import { CopyOutlined, DeleteOutlined } from '@ant-design/icons';
import { BaseDrawer, FaFlexRestLayout, FaUtils } from '@fa/ui';
import { Button, Form, Popconfirm, Space, Tabs } from 'antd';
import clsx from 'clsx';
import { useEffect } from 'react';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import FaFormShowModal from '../formShow/modal/FaFormShowModal';
import FaFormEditorItem from './cube/FaFormEditorItem';
import useFormConfig from './hooks/useFormConfig';
import './index.scss';
import FormItemPropertyPanel from './panel/FormItemPropertyPanel';
import { useFaFormStore } from './stores/useFaFormStore';
import FormItemDragPanel from './panel/FormItemDragPanel';
import FormPropertyPanel from './panel/FormPropertyPanel';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';


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
  const clearConfig = useFaFormStore((state) => state.clearConfig);

  const clearFormItems = useFaFormStore((state) => state.clearFormItems);

  const setLayout = useFaFormStore((state) => state.setLayout);

  const selectedFormItem = useFaFormStore((state) => state.selectedFormItem);
  const setSelectedFormItem = useFaFormStore((state) => state.setSelectedFormItem);

  const {layout, formItemMap, formConfig} = useFormConfig(config);

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
    // 只保存layout的i,x,y,w,h字段，其他字段不需要保存
    const filteredConfig = {
      ...config,
      layout: config.layout?.map((item) => ({
        i: item.i,
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      })),
    };
    onChange?.(filteredConfig);
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
    <div className='fa-full fa-flex-row fa-gap12'>
      <div style={{ width: 250 }} className='fa-flex-column fa-gap12 fa-scroll-auto-y'>
        <FormItemDragPanel />
      </div>

      {/* right  */}
      <div style={{ flex: 1, position: 'relative' }} className='fa-flex-column fa-card-p0'>
        {/* toolbar */}
        <div style={{ height: 40 }} className='fa-border-b fa-flex-row-center fa-gap12 fa-pl12 fa-pr12'>
          {config && (
            <Space>
              <FaFormShowModal title="预览表单" config={config}>
                <Button size="small">预览</Button>
              </FaFormShowModal>
              <BaseDrawer triggerDom={<Button size="small">查看JSON</Button>} title="流程配置JSON" size={600} forceRender push={false}>
                <JsonView
                  value={config}
                  style={lightTheme}
                  collapsed={3}
                />
              </BaseDrawer>
              <Popconfirm title="确定要清空表单吗？" onConfirm={() => clearConfig()}>
                <Button size="small" danger>清空</Button>
              </Popconfirm>
            </Space>
          )}
        </div>

        {/* form canvas */}
        <FaFlexRestLayout>
          <Form layout={formConfig.layout} labelCol={{ style: { width: formConfig.labelWidth } }} wrapperCol={{ style: {}}} >
            <div className='fa-full-content' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <FaGridLayout
                containerStyle={{ width: '100%', height: '100%', position: 'relative', background: 'var(--fa-bg-color)' }}
                style={{height: '100%', overflow: 'auto'}}
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
                            {/* TODO COPY BUTTON */}
                            {/* <Button size='small' onClick={(e) => {
                              FaUtils.preventEvent(e);
                            }} shape="circle" icon={<CopyOutlined />} color="primary" variant="outlined" /> */}
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
                onDrop={(layout, item, e:any) => {
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

      <div style={{ width: 320 }} className='fa-card-p0 fa-tabs-block'>
        <Tabs
          items={[
            { key: 'formItemProperty', label: '控件属性', children: <FormItemPropertyPanel /> },
            { key: 'formProperty', label: '表单属性', children: <FormPropertyPanel /> },
          ]}
        />
      </div>
    </div>
  );
}
