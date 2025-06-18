import React, { useState } from 'react';
import { Form, Input } from 'antd';
import { DragModal, type DragModalProps, FaUtils } from '@fa/ui';
// import MonacoEditor from "react-monaco-editor";

export interface FaCodeEditModal extends DragModalProps {
  value?: string;
  onChange?: (v: string) => void;
}

/**
 * 通用JSON编辑配置
 */
export default function FaCodeEditModal({ children, title, value, onChange, ...props }: FaCodeEditModal) {
  const [form] = Form.useForm();

  const [open, setOpen] = useState(false);

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    if (onChange) {
      onChange(fieldsValue.code);
    }
    setOpen(false);
  }

  function getInitialValues() {
    return {
      code: value,
    };
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue(getInitialValues());
  }

  return (
    <span>
      <span onClick={showModal}>{children}</span>
      <DragModal title={title} open={open} onOk={() => form.submit()} onCancel={() => setOpen(false)} width={700} {...props}>
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="code" label="配置项" rules={[{ required: true }]} {...FaUtils.formItemFullLayout}>
            <Input.TextArea autoSize={{ minRows: 1, maxRows: 25 }} />

            {/*<MonacoEditor*/}
            {/*  height={600}*/}
            {/*  language="sql"*/}
            {/*  theme="vs-dark"*/}
            {/*  options={{*/}
            {/*    selectOnLineNumbers: true,*/}
            {/*    folding: true,*/}
            {/*    minimap: { enabled: true },*/}
            {/*  }}*/}
            {/*/>*/}
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
