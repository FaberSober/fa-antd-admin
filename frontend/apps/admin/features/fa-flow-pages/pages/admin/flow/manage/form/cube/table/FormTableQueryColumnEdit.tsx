import { Flow } from '@/types';
import { Checkbox, Form, Input, Select } from 'antd';
import React, { useEffect } from 'react';
import { useFlowFormEditStore } from '../../store/useFlowFormEditStore';

export interface FormTableQueryColumnEditProps {
  column: Flow.TableConfiQueryColumn;
  onSuccess?: () => void;
}

/**
 * @author xu.pengfei
 * @date 2025-12-20 20:51:03
 */
export default function FormTableQueryColumnEdit({ column, onSuccess }: FormTableQueryColumnEditProps) {
  const [form] = Form.useForm();
    const { updateFlowFormTableConfigColumn } = useFlowFormEditStore()

  useEffect(() => {
    form.setFieldsValue({
      ...column,
    });
  }, []);

  function onFinish(fieldsValue: any) {}

  return (
    <Form form={form} onFinish={onFinish} style={{flex: 1}}
      onValuesChange={(cv, av) => {
        const newColumn = {...column, ...av};
        updateFlowFormTableConfigColumn(newColumn)
      }}
    >
      <div className='fa-flex-1 fa-flex-row-center fa-gap6' style={{  }}>
        {/* 列名 */}
        <div style={{ width: 120 }}>
          <Form.Item name="label" noStyle rules={[{ required: true }]}>
            <Input variant="filled" />
          </Form.Item>
        </div>
        {/* 字段 */}
        <div style={{ flex: 1 }}>
          {column.field}
        </div>
        {/* 类型 */}
        <div style={{ width: 120 }}>
          <Form.Item name="queryType" noStyle rules={[{ required: true }]}>
            <Select
              options={[
                {label: '等于查询', value: 'eq'},
                {label: '模糊查询', value: 'like'},
                {label: '范围查询', value: 'in'},
              ]}
            />
          </Form.Item>
        </div>
        {/* 默认值 */}
        <div style={{ width: 120 }}>
          <Form.Item name="default" noStyle rules={[{ required: false }]}>
            <Input variant="filled" />
          </Form.Item>
        </div>
        {/* 是否多选 */}
        <div style={{ width: 120, textAlign: 'center' }}>
          <Form.Item name="multiple" valuePropName="checked" noStyle>
            <Checkbox />
          </Form.Item>
        </div>
      </div>
    </Form>
  );
}
