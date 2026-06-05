import React, { useState } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseBoolRadio, type CommonModalProps, DragModal, FaHref, FaUtils, useApiLoading } from '@fa/ui';
import { Button, Form, Input, InputNumber } from 'antd';
import { get } from 'lodash';
import { tenantUserApi as api } from '@features/fa-admin-pages/services';
import { AllUserSearchSelect, TenantSearchSelect } from '@features/fa-admin-pages/components/helper';
import type { Tn } from '@/types';

const serviceName = '租户用户关联';

export default function TenantUserModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Tn.TenantUser>) {
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
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      tenantId: get(record, 'tenantId'),
      userId: get(record, 'userId'),
      isAdmin: get(record, 'isAdmin', false),
      status: get(record, 'status', true),
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
          <Form.Item name="tenantId" label="租户" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <TenantSearchSelect />
          </Form.Item>
          <Form.Item name="userId" label="用户" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <AllUserSearchSelect />
          </Form.Item>
          <Form.Item name="isAdmin" label="租户管理员" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseBoolRadio />
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
