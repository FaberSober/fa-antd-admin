import { Flow } from '@/types';
import { Checkbox, Form, Input, InputNumber, Select } from 'antd';
import React, { useEffect } from 'react';
import { useFlowFormEditStore } from '../../store/useFlowFormEditStore';

export interface FormTableColumnEditProps {
  column: Flow.TableConfigTableColumn;
  onSuccess?: () => void;
}

/**
 * @author xu.pengfei
 * @date 2025-12-21 11:08:00
 */
export default function FormTableColumnEdit({ column, onSuccess }: FormTableColumnEditProps) {
  const [form] = Form.useForm();
  const { updateFlowFormTableConfigTableColumn } = useFlowFormEditStore()

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
        updateFlowFormTableConfigTableColumn(newColumn)
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
        {/* 排序 */}
        <div style={{ width: 100, textAlign: 'center' }}>
          <Form.Item name="sorter" valuePropName="checked" noStyle>
            <Checkbox />
          </Form.Item>
        </div>
        {/* 固定位置 */}
        <div style={{ width: 100 }}>
          <Form.Item name="fix" noStyle rules={[{ required: true }]}>
            <Select
              options={[
                {label: '不固定', value: 'none'},
                {label: '左固定', value: 'left'},
                {label: '右固定', value: 'right'},
              ]}
            />
          </Form.Item>
        </div>
        {/* 宽度 */}
        <div style={{ width: 100 }}>
          <Form.Item name="width" noStyle rules={[{ required: false }]}>
            <InputNumber variant="filled" min={50} max={500} step={10} />
          </Form.Item>
        </div>
      </div>
    </Form>
  );
}
