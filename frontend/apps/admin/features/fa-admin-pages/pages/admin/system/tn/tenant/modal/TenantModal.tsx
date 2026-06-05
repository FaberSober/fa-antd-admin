import React, { useState } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseBoolRadio, type CommonModalProps, DragModal, FaHref, FaUtils, useApiLoading } from '@fa/ui';
import { Button, DatePicker, Form, Input, InputNumber } from 'antd';
import { get } from 'lodash';
import { tenantApi as api } from '@features/fa-admin-pages/services';
import type { Tn } from '@/types';

const serviceName = '租户';

export default function TenantModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Tn.Tenant>) {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);

  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, `新增${serviceName}`);
      setOpen(false);
      fetchFinish?.();
    });
  }

  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, `更新${serviceName}`);
      setOpen(false);
      fetchFinish?.();
    });
  }

  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      expireTime: fieldsValue.expireTime ? FaUtils.getDateFullStr(fieldsValue.expireTime) : undefined,
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      code: get(record, 'code'),
      name: get(record, 'name'),
      shortName: get(record, 'shortName'),
      status: get(record, 'status', true),
      expireTime: FaUtils.getInitialKeyTimeValue(record, 'expireTime'),
      contactName: get(record, 'contactName'),
      contactPhone: get(record, 'contactPhone'),
      contactEmail: get(record, 'contactEmail'),
      sort: get(record, 'sort', 0),
      description: get(record, 'description'),
    };
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue(getInitialValues());
  }

  const loading = useApiLoading([api.getUrl('save'), api.getUrl('update')]);
  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && (
          <Button icon={<PlusOutlined />} type="primary">
            新增
          </Button>
        )}
        {editBtn && <FaHref icon={<EditOutlined />} text="编辑" />}
      </span>
      <DragModal title={title} open={open} onOk={() => form.submit()} confirmLoading={loading} onCancel={() => setOpen(false)} width={800} {...props}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="code" label="租户编码" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入租户编码" maxLength={64} />
          </Form.Item>
          <Form.Item name="name" label="租户名称" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入租户名称" maxLength={255} />
          </Form.Item>
          <Form.Item name="shortName" label="租户简称" {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入租户简称" maxLength={255} />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
          <Form.Item name="expireTime" label="到期时间" {...FaUtils.formItemFullLayout}>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} placeholder="请选择到期时间" />
          </Form.Item>
          <Form.Item name="contactName" label="联系人" {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入联系人" maxLength={255} />
          </Form.Item>
          <Form.Item name="contactPhone" label="联系电话" {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入联系电话" maxLength={32} />
          </Form.Item>
          <Form.Item name="contactEmail" label="联系邮箱" {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入联系邮箱" maxLength={255} />
          </Form.Item>
          <Form.Item name="sort" label="排序" {...FaUtils.formItemFullLayout}>
            <InputNumber min={0} precision={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="描述" {...FaUtils.formItemFullLayout}>
            <Input.TextArea autoSize={{ minRows: 3, maxRows: 6 }} placeholder="请输入描述" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
