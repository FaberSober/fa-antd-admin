import React, { useEffect, useMemo } from 'react';
import { useFaFormStore } from '../stores/useFaFormStore';
import { cloneDeep, isNil } from 'lodash';
import { Button, Empty, Form, Input, Select, Space, Tag } from 'antd';
import FormItemInputProperty from './item/FormItemInputProperty';
import { SyncOutlined } from '@ant-design/icons';
import { FaUtils } from '@fa/ui';
import { FaFormItemsFieldTypes } from '../config';
import FormItemDecoTextProperty from './item/FormItemDecoTextProperty';
import FormItemDecoHrefProperty from './item/FormItemDecoHrefProperty';
import FormItemDecoHrProperty from './item/FormItemDecoHrProperty';

/**
 * @author xu.pengfei
 * @date 2025-12-17 15:01:10
 */
export default function FormItemPropertyPanel() {
  const [form] = Form.useForm();
  const flowForm = useFaFormStore((state) => state.flowForm);
  const selectedFormItem = useFaFormStore((state) => state.selectedFormItem);
  const updateSelectedFormItem = useFaFormStore((state) => state.updateSelectedFormItem);

  const columns = useMemo(() => {
    if (flowForm && flowForm.dataConfig && flowForm?.dataConfig?.main) {
      return flowForm.dataConfig.main.columns || [];
    }
    return [];
  }, [flowForm]);

  useEffect(() => {
    console.log('FormItemPropertyPanel selectedFormItem changed', selectedFormItem);
    form.setFieldsValue({
      tableName: selectedFormItem?.tableName,
      name: selectedFormItem?.name,
      label: selectedFormItem?.label,
      ...selectedFormItem,
    });
  }, [selectedFormItem]);

  const tableOptions = useMemo(() => {
    const options = [];
    if (flowForm && flowForm.dataConfig && flowForm?.dataConfig?.main) {
      options.push({ label: flowForm.dataConfig.main.comment, value: flowForm.dataConfig.main.tableName });
    }
    return options;
  }, [flowForm]);

  const columnOptions = useMemo(() => {
    const options = [];
    if (flowForm && flowForm.dataConfig && flowForm?.dataConfig?.main) {
      for (const col of columns) {
        options.push({ label: col.comment, value: col.field });
      }
    }
    return options;
  }, [flowForm]);

  if (isNil(selectedFormItem)) {
    return <Empty description="未选择表单项" className='fa-mt12' />;
  }

  // 判断是否绑定数据库的字段
  const isFieldItem = FaFormItemsFieldTypes.includes(selectedFormItem?.type);

  return (
    <div className='fa-flex-column fa-p12 fa-scroll-auto-y'>
      <div className='fa-mb12'>
        <Tag style={{fontSize: '13px'}} color='success' variant='solid' className='fa-hover' onClick={() => FaUtils.copyToClipboard(selectedFormItem.id)}>{selectedFormItem.id}</Tag>
      </div>

      <div>
        <Form form={form} styles={{ label: { width: 80 }}}
          // 1. 用户交互修改 → onValuesChange 自动同步 store
          onValuesChange={(cv, av) => {
            console.log('FormItemPanel form values changed', cv, av);
            const avCopy = cloneDeep(av);
            // update label from name
            if (!av.label && cv.name) {
              const col = columnOptions.find(c => c.value === cv.name);
              if (col) {
                avCopy.label = col.label;
                form.setFieldsValue({ label: col.label });
              }
            }
            updateSelectedFormItem(avCopy);
          }}
        >
          {isFieldItem && (
            <>
              <Form.Item name="tableName" label="数据库表" rules={[{ required: true }]}>
                <Select options={tableOptions} />
              </Form.Item>
              <Form.Item name="name" label="控件字段" rules={[{ required: true }]}>
                <Select options={columnOptions} />
              </Form.Item>
              <Space.Compact>
                <Form.Item name="label" label="控件标题" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
                <Button icon={<SyncOutlined />} onClick={() => {
                  const col = columnOptions.find(c => c.value === form.getFieldValue('name'));
                  console.log('Sync label from name', col);
                  if (col) {
                    form.setFieldsValue({ label: col.label });
                    updateSelectedFormItem(form.getFieldsValue()); // 关键：手动同步，这里不会触发 onValuesChange
                  }
                }}></Button>
              </Space.Compact>
            </>
          )}

          {selectedFormItem.type === 'input' && (<FormItemInputProperty />)}

          {selectedFormItem.type === 'deco_text' && (<FormItemDecoTextProperty />)}
          {selectedFormItem.type === 'deco_href' && (<FormItemDecoHrefProperty />)}
          {selectedFormItem.type === 'deco_hr' && (<FormItemDecoHrProperty />)}
        </Form>
      </div>
    </div>
  );
}
