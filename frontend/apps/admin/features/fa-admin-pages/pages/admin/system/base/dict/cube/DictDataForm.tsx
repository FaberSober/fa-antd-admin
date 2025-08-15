import React, { useEffect } from 'react';
import type { Admin } from '@/types';
import { Button, Checkbox, Form, Input, Popconfirm } from 'antd';
import { FaHref } from '@fa/ui';

export interface DictDataFormProps {
  dict?: Admin.DictData;
  onChange?: (v: Admin.DictData) => void;
  onDelete?: (v: Admin.DictData) => void;
}

/**
 * @author xu.pengfei
 * @date 2022/12/10 10:24
 */
export default function DictDataForm({dict, onChange, onDelete}: DictDataFormProps) {
  const [form] = Form.useForm();
  const isEdit = dict !== undefined;

  useEffect(() => {
    form.setFieldsValue(dict);
  }, [dict]);

  function onFinish(v: any) {
    // judge dict not change
    if (dict) {
      const keys = Object.keys(v);
      let hasChange = false;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        // @ts-ignore
        if (v[key] !== dict[key]) {
          hasChange = true;
        }
      }
      if (!hasChange) return;
    }

    if (onChange) {
      onChange({...dict, ...v});
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
      initialValues={{ valid: true }}
    >
      <div className="fa-p6" style={{flex: 1}}>
        <Form.Item name="label" label="字典名称" rules={[{required: true}]}>
          <Input onBlur={() => isEdit && form.submit()}/>
        </Form.Item>
      </div>
      <div className="fa-p6" style={{flex: 1}}>
        <Form.Item name="value" label="字典值" rules={[{required: true}]}>
          <Input onBlur={() => isEdit && form.submit()}/>
        </Form.Item>
      </div>
      <div className="fa-p6" style={{width: 100}}>
        <Form.Item name="isDefault" label="是否默认" valuePropName="checked" className="fa-flex-center">
          <Checkbox onChange={() => isEdit && form.submit()}/>
        </Form.Item>
      </div>
      <div className="fa-p6" style={{width: 100}}>
        <Form.Item name="valid" label="是否生效" valuePropName="checked" className="fa-flex-center">
          <Checkbox onChange={() => isEdit && form.submit()}/>
        </Form.Item>
      </div>
      <div className="fa-p6" style={{flex: 1}}>
        <Form.Item name="description" label="描述">
          <Input onBlur={() => isEdit && form.submit()}/>
        </Form.Item>
      </div>
      <div className="fa-p6 fa-flex-row-center" style={{width: 80, height: 44}}>
        {dict !== undefined && (
          <Popconfirm title="确认删除?" onConfirm={() => onDelete && onDelete(dict)} placement="topRight">
            <FaHref text="删除" style={{color: '#F00'}}/>
          </Popconfirm>
        )}
        {dict === undefined && (
          <Button size="small" type="primary" htmlType="submit">
            新增
          </Button>
        )}
      </div>
    </Form>
  );
}
