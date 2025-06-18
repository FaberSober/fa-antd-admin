import React, {useState} from 'react';
import {Form} from 'antd';
import {DragModal, DragModalProps, UploadFileLocalMultiple} from "@ui/components";
import {FaUtils} from "@ui/utils";


export interface UploadFileModalProps extends DragModalProps {
  onSubmit?: (fileIds: string[]) => Promise<any>;
}

/**
 * Demo-学生表实体新增、编辑弹框
 */
export default function UploadFileModal({children, onSubmit, ...props}: UploadFileModalProps) {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  /** 提交表单 */
  function onFinish(fieldsValue: any) {
    if (onSubmit) {
      setLoading(true)
      onSubmit(fieldsValue.fileIds)
        .then(() => {
          setLoading(false)
          setOpen(false)
        }).catch(() => setLoading(false))
      return;
    }
    setOpen(false)
  }

  function showModal() {
    setOpen(true);
    form.setFieldsValue({fileIds: []});
  }

  return (
    <span>
      <span onClick={showModal}>
        {children}
      </span>
      <DragModal
        title="上传附件"
        open={open}
        onOk={() => form.submit()}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        width={700}
        {...props}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item name="fileIds" label="附件" rules={[{required: true}]} {...FaUtils.formItemFullLayout}>
            <UploadFileLocalMultiple/>
          </Form.Item>
        </Form>
      </DragModal>
    </span>
  );
}
