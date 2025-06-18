import React, { useContext, useState } from 'react';
import { Button, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ApiEffectLayoutContext, type CommonModalProps, DragModal, FaUtils, UploadFileLocal } from '@fa/ui';
import { fileSaveApi as api } from '@features/fa-admin-pages/services';
import type { Admin } from '@/types';

/**
 * BASE-用户文件表实体新增、编辑弹框
 */
export default function FileSaveModal({ children, title, record, fetchFinish, addBtn, editBtn, ...props }: CommonModalProps<Admin.FileSave>) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  function showModal() {
    setOpen(true);
    form.setFieldsValue({ url: undefined });
  }

  const loading = loadingEffect[api.getUrl('save')] || loadingEffect[api.getUrl('update')];
  return (
    <span>
      <span onClick={showModal}>
        {children}
        {addBtn && (
          <Button icon={<PlusOutlined />} type="primary">
            上传
          </Button>
        )}
      </span>
      <DragModal
        title={title}
        open={open}
        confirmLoading={loading}
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => setOpen(false)}
        cancelText="关闭"
        width={700}
        {...props}
      >
        <Form form={form}>
          <Form.Item name="url" label="上传文件" rules={[{ required: false }]} {...FaUtils.formItemFullLayout}>
            <UploadFileLocal multiple onChange={fetchFinish} />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
