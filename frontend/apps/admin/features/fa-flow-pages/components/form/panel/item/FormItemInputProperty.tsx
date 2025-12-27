import { Form, Input } from 'antd';
import React from 'react';

/**
 * @author xu.pengfei
 * @date 2025-12-27 09:34:16
 */
export default function FormItemInputProperty() {
  return (
    <div>
      <Form.Item name="placeholder" label="占位符" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
    </div>
  );
}
