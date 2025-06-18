import React, { useContext, useState } from 'react';
import { Button, Form } from 'antd';
import { ApiEffectLayoutContext, CommonModalProps, DragModal, FaUtils } from '@fa/ui';
import { Disk } from '@/types';
import { StoreFileCascader } from '@/components';
import { storeFileApi } from '@/services';

export interface StoreDirModalProps extends CommonModalProps<Disk.StoreBucket> {
  fileIds: number[];
}

/**
 * STORE-移动到文件夹
 */
export default function StoreFileMoveToModal({
  children,
  title,
  record,
  fetchFinish,
  addBtn,
  editBtn,
  onOpen,
  fileIds,
  ...props
}: StoreDirModalProps) {
  const { loadingEffect } = useContext(ApiEffectLayoutContext);
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    storeFileApi.moveToDir(fileIds, fieldsValue.toDirId).then((res) => {
      FaUtils.showResponse(res, '移动到目录');
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

  const loading = loadingEffect[storeFileApi.getUrl('moveToDir')];
  return (
    <span>
      <span onClick={showModal}>{children || <Button>移动到...</Button>}</span>
      <DragModal
        title="移动到"
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="toDirId" label="移动到" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <StoreFileCascader showRoot disabledIds={fileIds} />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
