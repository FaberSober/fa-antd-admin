import { Flow } from '@/types';
import { Form, FormInstance, FormProps, Input } from 'antd';
import React from 'react';
import FaRenderFormItem from './render/FaRenderFormItem';

export interface FaFormShowProps extends FormProps<any> {
  config: Flow.FlowFormConfig;
}

/**
 * @author xu.pengfei
 * @date 2025-12-17 11:10:21
 */
export default function FaFormShow({ config, ...props }: FaFormShowProps) {

  return (
    <div>
      <Form {...props}>
        {/* Render form items based on config */}
        {config.formItems.map((item: any) => {
          return (<FaRenderFormItem key={item.id} formItem={item} />);
        })}
      </Form>
    </div>
  );
}
