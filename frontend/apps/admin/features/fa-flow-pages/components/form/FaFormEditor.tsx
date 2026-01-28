import { Flow } from '@/types';
import { BaseDrawer, FaFlexRestLayout } from '@fa/ui';
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';
import { Button, Form, Popconfirm, Space, Tabs } from 'antd';
import { useEffect } from 'react';
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import FaFormShowModal from '../formShow/modal/FaFormShowModal';
import FaFormCanvas from './FaFormCanvas';
import useFormConfig from './hooks/useFormConfig';
import './index.scss';
import FormItemDragPanel from './panel/FormItemDragPanel';
import FormItemPropertyPanel from './panel/FormItemPropertyPanel';
import FormPropertyPanel from './panel/FormPropertyPanel';
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
  const config = useFaFormStore((state) => state.config);
  const initialized = useFaFormStore((state) => state.initialized);
  const init = useFaFormStore((state) => state.init);

  const removeFormItem = useFaFormStore((state) => state.removeFormItem);
  const clearConfig = useFaFormStore((state) => state.clearConfig);

  const clearFormItems = useFaFormStore((state) => state.clearFormItems);

  const selectedFormItem = useFaFormStore((state) => state.selectedFormItem);
  const setSelectedFormItem = useFaFormStore((state) => state.setSelectedFormItem);

  const {formConfig} = useFormConfig(config);

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
    // console.log('outConfig changed:', outConfig);
  }, [outConfig]);

  useEffect(() => {
    // console.log('config changed:', config);
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
              <FaFormCanvas />
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
