import React, { useEffect } from 'react';
import { useFaFormStore } from '../stores/useFaFormStore';
import { isNil } from 'lodash';
import { Form, Input } from 'antd';

/**
 * @author xu.pengfei
 * @date 2025-12-17 15:01:10
 */
export default function FormItemPanel() {
  const [form] = Form.useForm();
  const selectedFormItem = useFaFormStore((state) => state.selectedFormItem);
  const updateSelectedFormItem = useFaFormStore((state) => state.updateSelectedFormItem);

  useEffect(() => {
    console.log('FormItemPanel selectedFormItem changed', selectedFormItem);
    form.setFieldsValue({
      name: selectedFormItem?.name,
    });
  }, [selectedFormItem]);

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
            updateSelectedFormItem(av);
          }}
        >
          <Form.Item name="name" label="控件标题" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
