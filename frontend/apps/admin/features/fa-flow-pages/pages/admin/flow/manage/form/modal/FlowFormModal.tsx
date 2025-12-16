import React, { useState } from 'react';
import { get } from 'lodash';
import { Button, Form, Input } from 'antd';
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { useApiLoading, DragModal, FaHref, FaUtils, CommonModalProps } from '@fa/ui';
import { flowFormApi as api } from '@/services';
import { Flow } from '@/types';
import { FlowCatagoryCascader } from '@features/fa-flow-pages/components';


/**
 * FLOW-流程表单实体新增、编辑弹框
 */
export default function FlowFormModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Flow.FlowForm>) {
  const loading = useApiLoading([ api.getUrl('save'), api.getUrl('update')]);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 新增Item */
  function invokeInsertTask(params: any) {
    api.save(params).then((res) => {
      FaUtils.showResponse(res, '新增流程表单');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 更新Item */
  function invokeUpdateTask(params: any) {
    api.update(params.id, params).then((res) => {
      FaUtils.showResponse(res, '更新流程表单');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    })
  }

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    const values = {
      ...fieldsValue,
      config: {},
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
      catagoryId: get(record, 'catagoryId'),
      name: get(record, 'name'),
      no: get(record, 'no'),
      type: get(record, 'type'),
      status: get(record, 'status'),
      sort: get(record, 'sort'),
      icon: get(record, 'icon'),
      tableName: get(record, 'tableName'),
      remark: get(record, 'remark'),
      config: get(record, 'config'),
      // birthday: FaUtils.getInitialKeyTimeValue(record, 'birthday'),
    }
  }

  function showModal() {
    setOpen(true)
    form.setFieldsValue(getInitialValues())
  }

  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && <Button icon={<PlusOutlined />} type="primary">新增</Button>}
        {editBtn && <FaHref icon={<EditOutlined />} text="编辑" />}
      </span>
      <DragModal
        title={title}
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={800}
        {...props}
      >
        <Form form={form} onFinish={onFinish} className='fa-grid2 fa-mt12' {...FaUtils.formItemHalfLayout}>
          <Form.Item name="catagoryId" label="流程分类" rules={[{ required: true }]}>
            <FlowCatagoryCascader placeholder="请选择流程分类" />
          </Form.Item>
          <Form.Item name="name" label="名称" rules={[{ required: true }]}>
            <Input placeholder="请输入名称" />
          </Form.Item>
          <Form.Item name="no" label="编码" rules={[{ required: true }]}>
            <Input placeholder="请输入编码" />
          </Form.Item>
          <Form.Item name="type" label="表单类型" rules={[{ required: true }]}>
            <Input placeholder="请输入表单类型" />
          </Form.Item>
          <Form.Item name="status" label="状态" rules={[{ required: true }]}>
            <Input placeholder="请输入状态" />
          </Form.Item>
          <Form.Item name="sort" label="排序" rules={[{ required: true }]}>
            <Input placeholder="请输入排序" />
          </Form.Item>
          <Form.Item name="icon" label="图标" rules={[{ required: false }]}>
            <Input placeholder="请输入图标" />
          </Form.Item>
          <Form.Item name="tableName" label="表名" rules={[{ required: true }]}>
            <Input placeholder="请输入表名" />
          </Form.Item>
          <Form.Item name="remark" label="备注" rules={[{ required: false }]}>
            <Input placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  )
}
