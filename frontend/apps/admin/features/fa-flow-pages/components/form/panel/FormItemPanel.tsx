import React, { useEffect, useMemo } from 'react';
import { useFaFormStore } from '../stores/useFaFormStore';
import { isNil } from 'lodash';
import { Form, Input, Select } from 'antd';

/**
 * @author xu.pengfei
 * @date 2025-12-17 15:01:10
 */
export default function FormItemPanel() {
  const [form] = Form.useForm();
  const flowForm = useFaFormStore((state) => state.flowForm);
  const selectedFormItem = useFaFormStore((state) => state.selectedFormItem);
  const updateSelectedFormItem = useFaFormStore((state) => state.updateSelectedFormItem);

  useEffect(() => {
    console.log('FormItemPanel selectedFormItem changed', selectedFormItem);
    form.setFieldsValue({
      tableName: selectedFormItem?.tableName,
      name: selectedFormItem?.name,
      label: selectedFormItem?.label,
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
      for (const col of flowForm.dataConfig.main.columns) {
        options.push({ label: col.comment, value: col.field });
      }
    }
    return options;
  }, [flowForm]);

  if (isNil(selectedFormItem)) {
    return <div>未选中任何表单项</div>;
  }

  return (
    <div>
      <h3>选中项 ID: {selectedFormItem.id}</h3>

      <div>
        <Form form={form} labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}
          onValuesChange={(cv, av) => {
            console.log('FormItemPanel form values changed', cv, av);
            // update label from name
            if (!av.label && cv.name) {
              const col = columnOptions.find(c => c.value === cv.name);
              if (col) {
                av.label = col.label;
                form.setFieldsValue({ label: col.label });
              }
            }
            updateSelectedFormItem(av);
          }}
        >
          <Form.Item name="tableName" label="数据库表" rules={[{ required: true }]}>
            <Select options={tableOptions} />
          </Form.Item>
          <Form.Item name="name" label="控件字段" rules={[{ required: true }]}>
            <Select options={columnOptions} />
          </Form.Item>
          <Form.Item name="label" label="控件标题" rules={[{ required: true }]}>
            <Input />
            {/* TODO add button: sync label from name */}
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
