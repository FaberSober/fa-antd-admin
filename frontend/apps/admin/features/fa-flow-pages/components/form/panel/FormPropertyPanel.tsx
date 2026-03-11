import { Form, InputNumber, Radio } from 'antd';
import React, { useEffect } from 'react';
import { useFaFormStore } from '../stores/useFaFormStore';

/**
 * @author xu.pengfei
 * @date 2025-12-26 20:32:35
 */
export default function FormPropertyPanel() {
  const [form] = Form.useForm();
  const config = useFaFormStore((state) => state.config);
  const updateFormConfig = useFaFormStore((state) => state.updateFormConfig);

  useEffect(() => {
    form.setFieldsValue({
      labelWidth: config?.formConfig?.labelWidth || 80,
      layout: config?.formConfig?.layout || 'horizontal',
    });
  }, [config, form]);

  return (
    <div className='fa-flex-column fa-p12 fa-scroll-auto-y'>
      <Form form={form} styles={{ label: { width: 80 }}}
        onValuesChange={(cv, av) => {
          console.log('FormPropertyPanel form values changed', cv, av);
          const newFormConfig = {
            ...config?.formConfig,
            ...av,
          };
          updateFormConfig(newFormConfig);
        }}
      >
        <Form.Item name="labelWidth" label="标题宽度" rules={[{ required: true }]}>
          <InputNumber min={10} max={200} />
        </Form.Item>
        {/* <Form.Item name="layout" label="表单布局" rules={[{ required: true }]}>
          <Radio.Group
            options={[
              { label: '水平', value: 'horizontal' },
              { label: '垂直', value: 'vertical' },
              { label: '行内', value: 'inline' },
            ]}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item> */}
      </Form>
    </div>
  );
}
