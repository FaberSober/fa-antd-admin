import React, { useEffect } from 'react';
import type { Admin } from '@/types';
import { Button, Form, Input, Popconfirm } from 'antd';
import { FaHref } from '@fa/ui';

export interface DictFormProps {
  dict?: Admin.Option;
  onChange?: (v: Admin.Option) => void;
  onDelete?: (v: Admin.Option) => void;
}

/**
 * @author xu.pengfei
 * @date 2022/12/10 10:24
 */
export default function DictForm({ dict, onChange, onDelete }: DictFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(dict);
  }, [dict]);

  function onFinish(v: any) {
    // judge dict not change
    if (v.label === dict?.label && v.value === dict?.value) {
      return;
    }
    if (onChange) {
      onChange({ ...dict, ...v });
    }
    if (dict === undefined) {
      form.resetFields();
    }
  }

  return (
    <Form form={form} onFinish={onFinish} layout="inline" className="fa-flex-row-center fa-full-w fa-form-underline">
      <div className="fa-p12" style={{ flex: 1 }}>
        <Form.Item name="label" rules={[{ required: true }]}>
          <Input onBlur={form.submit} />
        </Form.Item>
      </div>
      <div className="fa-p12" style={{ flex: 1 }}>
        <Form.Item name="value" rules={[{ required: true }]}>
          <Input onBlur={form.submit} />
        </Form.Item>
      </div>
      <div className="fa-p12" style={{ width: 80 }}>
        {dict === undefined && (
          <Button size="small" type="primary" htmlType="submit">
            新增
          </Button>
        )}
        {dict !== undefined && (
          <Popconfirm title="确认删除?" onConfirm={() => onDelete && onDelete(dict)} placement="topRight">
            <FaHref text="删除" style={{ color: '#F00' }} />
          </Popconfirm>
        )}
      </div>
    </Form>
  );
}
