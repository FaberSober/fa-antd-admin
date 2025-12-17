import { Flow } from '@/types';
import { Form, Input } from 'antd';
import React from 'react';

export interface FaRenderFormItemProps {
  formItem: Flow.FlowFormItem;
}

/**
 * @author xu.pengfei
 * @date 2025-12-17 11:17:01
 */
export default function FaRenderFormItem({ formItem }: FaRenderFormItemProps) {

  if (formItem.type === 'row') {
    return (
      <div className="fa-flex-row" style={{ gap: 16 }}>
        {formItem.children?.map((child) => (
          <div key={child.id} style={{ flex: 1 }}>
            <FaRenderFormItem formItem={child} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Form.Item
      key={formItem.id}
      label={formItem.label}
      name={formItem.name}
      rules={formItem.rules}
    >
      {/* Render input based on item type */}
      {formItem.type === 'input' && <Input />}
    </Form.Item>
  );
}
