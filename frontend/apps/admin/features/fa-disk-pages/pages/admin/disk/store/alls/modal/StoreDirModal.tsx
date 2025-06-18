import React, { useContext, useEffect, useState } from 'react';
import { get } from 'lodash';
import { Button, Form, Input } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import { ApiEffectLayoutContext, CommonModalProps, DragModal, FaHref, FaUtils } from '@fa/ui';
import { storeFileApi as api } from '@/services';
import { Disk } from '@/types';
import { DiskContext } from '@/layout';

export interface StoreDirModalProps extends CommonModalProps<Disk.StoreFile> {
  dirId: number;
}

/**
 * STORE-目录新增、编辑弹框
 */
export default function StoreDirModal({
  children,
  title,
  record,
  fetchFinish,
  addBtn,
  editBtn,
  onOpen,
  dirId,
  ...props
}: StoreDirModalProps) {
  const { bucket } = useContext(DiskContext);
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 提交表单 */
  async function onFinish(fieldsValue: any) {
    const values = {
      size: 0,
      dir: true,
      tags: [],
      ...record,
      ...fieldsValue,
      bucketId: bucket.id,
      parentId: dirId,
    };
    if (record) {
      const res = await api.update(record.id, values);
      FaUtils.showResponse(res, '更新信息');
    } else {
      const res = await api.save(values);
      FaUtils.showResponse(res, '新增目录信息');
    }

    setOpen(false);
    if (fetchFinish) fetchFinish();
  }

  function getInitialValues() {
    return {
      name: get(record, 'name'),
    };
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue(getInitialValues());
    if (onOpen) onOpen();
  }

  useEffect(() => {
    form.setFieldsValue(getInitialValues());
  }, [record]);

  const loading = loadingEffect[api.getUrl('saveOrUpdate')];
  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && (
          <Button icon={<PlusOutlined />} type="primary">
            新建目录
          </Button>
        )}
        {editBtn && <FaHref icon={<EditOutlined />} text="编辑" />}
      </span>
      <DragModal
        title={title}
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="name" label="名称" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
