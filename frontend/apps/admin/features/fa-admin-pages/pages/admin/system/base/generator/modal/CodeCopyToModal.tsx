import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { DragModal, type DragModalProps, FaUtils } from '@fa/ui';

export interface CodeCopyToModalProps extends DragModalProps {
  onSubmit: (path: string) => void;
}

/**
 * 代码生成-复制当前文件到指定的绝对路径
 */
export default function CodeCopyToModal({ children, onSubmit, ...props }: CodeCopyToModalProps) {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    if (onSubmit) {
      onSubmit(fieldsValue.path);
    }
    setOpen(false);
  }

  function showModal() {
    setOpen(true);
  }

  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <DragModal title="复制当前文件到..." open={open} onOk={() => form.submit()} onCancel={() => setOpen(false)} width={700} {...props}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="path" label="复制路径" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input.TextArea placeholder="请填写要复制到的目录的绝对路径" autoSize />
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
