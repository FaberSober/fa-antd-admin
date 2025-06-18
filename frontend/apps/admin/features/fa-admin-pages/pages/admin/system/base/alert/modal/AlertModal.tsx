import React, { useContext, useState } from 'react';
import { get } from 'lodash';
import { Button, Form, Input } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ApiEffectLayoutContext, BaseBoolRadio, type CommonModalProps, DictDataSelector, DragModal, FaHref, FaUtils } from '@fa/ui';
import { alertApi as api } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';

/**
 * BASE-告警信息实体新增、编辑弹框
 */
export default function AlertModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Admin.Alert>) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, '新增BASE-告警信息');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新BASE-告警信息');
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
      content: get(record, 'content'),
      type: get(record, 'type'),
      deal: get(record, 'deal'),
      dutyStaff: get(record, 'dutyStaff'),
      dealStaff: get(record, 'dealStaff'),
      dealTime: get(record, 'dealTime'),
      dealDesc: get(record, 'dealDesc'),
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
          <Form.Item name="type" label="告警类型" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <DictDataSelector dictLabel="alert.type" placeholder="请输入告警类型" />
          </Form.Item>
          <Form.Item name="content" label="告警内容" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入告警内容" />
          </Form.Item>
          <Form.Item name="deal" label="是否处理" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <BaseBoolRadio />
          </Form.Item>
          <Form.Item name="dutyStaff" label="负责人" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入负责人" />
          </Form.Item>
          <Form.Item name="dealStaff" label="处理人" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入处理人" />
          </Form.Item>
          <Form.Item name="dealTime" label="处理时间" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入处理时间" />
          </Form.Item>
          <Form.Item name="dealDesc" label="处理描述" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <Input placeholder="请输入处理描述" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
