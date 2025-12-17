import { Flow } from '@/types';
import { Form, Input } from 'antd';
import React from 'react';
import FaRenderFormItem from './render/FaRenderFormItem';

export interface FaFormShowProps {
  config: Flow.FlowFormConfig;
}

/**
 * @author xu.pengfei
 * @date 2025-12-17 11:10:21
 */
export default function FaFormShow({ config }: FaFormShowProps) {
  const [form] = Form.useForm();

  function onFinish(values: any) {
    console.log('Form submitted with values:', values);
  }

  return (
    <div>
      <Form form={form} onFinish={onFinish}>
        {/* Render form items based on config */}
        {config.formItems.map((item: any) => {
          return (<FaRenderFormItem key={item.id} formItem={item} />);
        })}
      </Form>
    </div>
  );
}
