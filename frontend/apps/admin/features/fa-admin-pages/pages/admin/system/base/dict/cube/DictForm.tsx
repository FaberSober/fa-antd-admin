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
    <Form
      form={form}
      onFinish={onFinish}
      variant="filled"
      layout="inline"
      className="fa-flex-row fa-full-w fa-form-m0 fa-item"
      labelCol={{style: {display: 'none'}}}
    >
      <div className="fa-p6" style={{flex: 1}}>
        <Form.Item name="label" label="字典名称" rules={[{required: true}]}>
          <Input onBlur={form.submit}/>
        </Form.Item>
      </div>
      <div className="fa-p6" style={{flex: 1}}>
        <Form.Item name="value" label="字典值" rules={[{required: true}]}>
          <Input onBlur={form.submit}/>
        </Form.Item>
      </div>
      <div className="fa-p6 fa-flex-row-center" style={{width: 80, height: 44}}>
        {dict === undefined && (
          <Button size="small" type="primary" htmlType="submit">
            新增
          </Button>
        )}
        {dict !== undefined && (
          <Popconfirm title="确认删除?" onConfirm={() => onDelete && onDelete(dict)} placement="topRight">
            <FaHref text="删除" style={{color: '#F00'}}/>
          </Popconfirm>
        )}
      </div>
    </Form>
  );
}
