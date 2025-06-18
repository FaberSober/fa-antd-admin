import React, { useContext, useState } from 'react';
import { get } from 'lodash';
import { Button, Form, Input } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { BaseBoolRadio, DragModal, FaHref, ApiEffectLayoutContext, FaUtils, type CommonModalProps } from '@fa/ui';
import { userDeviceApi as api } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';
import { UserSearchSelect } from '@features/fa-admin-pages/components';

/**
 * BASE-用户设备实体新增、编辑弹框
 */
export default function UserDeviceModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Admin.UserDevice>) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, '新增BASE-用户设备');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新BASE-用户设备');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      // birthday: FaUtils.getDateStr000(fieldsValue.birthday),
    };
    if (record) {
      invokeUpdateTask({ ...record, ...values });
    } else {
      invokeInsertTask({ ...values });
    }
  }

  function getInitialValues() {
    return {
      userId: get(record, 'userId'),
      deviceId: get(record, 'deviceId'),
      model: get(record, 'model'),
      manufacturer: get(record, 'manufacturer'),
      os: get(record, 'os'),
      osVersion: get(record, 'osVersion'),
      enable: get(record, 'enable'),
      // birthday: FaUtils.getInitialKeyTimeValue(record, 'birthday'),
    };
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue(getInitialValues());
  }

  const loading = loadingEffect[api.getUrl('save')] || loadingEffect[api.getUrl('update')];
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
          <Form.Item name="userId" label="所属用户ID" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <UserSearchSelect placeholder="请输入所属用户ID" />
          </Form.Item>
          <Form.Item name="deviceId" label="设备ID" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入设备ID" />
          </Form.Item>
          <Form.Item name="enable" label="是否允许访问" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
          <Form.Item name="model" label="设备型号" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入设备型号" />
          </Form.Item>
          <Form.Item name="manufacturer" label="设备厂商" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入设备厂商" />
          </Form.Item>
          <Form.Item name="os" label="系统" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入系统" />
          </Form.Item>
          <Form.Item name="osVersion" label="系统版本号" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入系统版本号" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
