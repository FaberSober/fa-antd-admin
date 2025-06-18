import React, { useContext, useState } from 'react';
import { get } from 'lodash';
import { Button, Form, Input } from 'antd';
import { ApiEffectLayoutContext, BaseBoolRadio, type CommonModalProps, DragModal, FaHref, FaUtils } from '@fa/ui';
import type { Rbac } from '@/types';
import { rbacRoleApi } from '@features/fa-admin-pages/services';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const serviceName = '';

/**
 * BASE-角色表实体新增、编辑弹框
 */
export default function RbacRoleModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Rbac.RbacRole>) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    rbacRoleApi.save(params).then((res) => {
      FaUtils.showResponse(res, `新增${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    rbacRoleApi.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, `更新${serviceName}`);
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      // birthday: getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      name: get(record, 'name'),
      remarks: get(record, 'remarks'),
      status: get(record, 'status', true),
    };
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue(getInitialValues());
  }

  const loading = loadingEffect[rbacRoleApi.getUrl('save')] || loadingEffect[rbacRoleApi.getUrl('update')];
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
      <DragModal title={title} open={open} onOk={() => form.submit()} confirmLoading={loading} onCancel={() => setOpen(false)} width={700} {...props}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="name" label="角色名称" rules={[{ required: true }, { max: 10 }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="remarks" label="角色描述" rules={[{ required: true }, { max: 100 }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label="是否启用" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
