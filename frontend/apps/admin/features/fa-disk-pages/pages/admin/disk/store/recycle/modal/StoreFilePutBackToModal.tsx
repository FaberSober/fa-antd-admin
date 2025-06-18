import React, { useContext, useState } from 'react';
import { Button, Form } from 'antd';
import { ApiEffectLayoutContext, CommonModalProps, DragModal, FaUtils } from '@fa/ui';
import { Disk } from '@/types';
import { StoreFileCascader } from '@/components';
import { storeFileApi } from '@/services';

export interface StoreFilePutBackToModalProps extends CommonModalProps<Disk.StoreBucket> {
  fileIds: number[];
}

/**
 * STORE-恢复到目录
 */
export default function StoreFilePutBackToModal({
  children,
  title,
  record,
  fetchFinish,
  addBtn,
  editBtn,
  onOpen,
  fileIds,
  ...props
}: StoreFilePutBackToModalProps) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    storeFileApi.putBackToDir(fileIds, fieldsValue.toDirId).then((res) => {
      FaUtils.showResponse(res, '恢复到目录');
      setOpen(false);
      if (fetchFinish) fetchFinish();
    });
  }

  function getInitialValues() {
    return {
      toDirId: undefined,
    };
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue(getInitialValues());
    if (onOpen) onOpen();
  }

  const loading = loadingEffect[storeFileApi.getUrl('putBackToDir')];
  return (
    <span>
      <span onClick={showModal}>{children || <Button>恢复到...</Button>}</span>
      <DragModal
        title="恢复到目录"
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="toDirId" label="恢复到" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <StoreFileCascader showRoot disabledIds={fileIds} />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
