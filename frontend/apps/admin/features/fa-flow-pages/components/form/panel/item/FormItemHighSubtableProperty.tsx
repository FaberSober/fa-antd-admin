import { Form, Input, Select } from 'antd';
import React from 'react';
import { useFaFormStore } from '../../stores/useFaFormStore';

/**
 * @author xu.pengfei
 * @date 2026-01-31 20:02:57
 */
export default function FormItemHighSubtableProperty() {
  const flowForm = useFaFormStore((state) => state.flowForm);
  
  return (
    <div>
      <Form.Item name="label" label="控件标题" rules={[{ required: true }]}>
        <Input allowClear />
      </Form.Item>
      <Form.Item name="subtable_tableName" label="关联子表" rules={[{ required: true }]}>
        <Select
          placeholder="选择关联子表"
          allowClear
          options={[]}
        />
      </Form.Item>
    </div>
  );
}