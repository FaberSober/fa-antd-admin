import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaUtils } from '@fa/ui';
import { FaFlowForm } from '@features/fa-flow-pages/components';
import { Button, Form, Space } from 'antd';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';

export interface FormAddProps {
  flowForm: Flow.FlowForm;
  onSuccess?: () => void;
}

/**
 * 简单表格新增
 * @author xu.pengfei
 * @date 2026-02-06 11:10:14
 */
export default function FormAdd({ flowForm, onSuccess }: FormAddProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState<boolean>(false);

  const handleSubmit = React.useCallback(() => {
    form.submit();
  }, [form]);

  const handleFormSubmit = React.useCallback((formValues: any) => {
    setFormLoading(true);
    // 保存表单数据
    flowFormApi.saveFormData({
      formId: flowForm.id,
      formData: formValues,
    }).then(res => {
      FaUtils.showResponse(res, '新增');
      setOpen(false);
      form.resetFields();
      onSuccess?.();
    }).finally(() => {
      setFormLoading(false);
    });
  }, [flowForm.id, form, onSuccess]);

  const handleAdd = React.useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    form.resetFields();
  }, [form]);

  const content = React.useMemo(() => {
    if (!open) return null;
    
    return (
      <div className='fa-full-content fa-bg-white fa-flex-column' style={{ zIndex: 999 }}>
        {/* header */}
        <div className='fa-flex-row-center fa-border-b fa-p12'>
          <Space>
            <Button color="default" variant="text" onClick={handleClose} icon={<ArrowLeftOutlined />} />
            <div className='fa-h3'>新增 - {flowForm.name}</div>
          </Space>
          <div className='fa-flex-1' />
          <Space>
            <Button onClick={handleSubmit} type='primary' loading={formLoading}>提交</Button>
            <Button onClick={handleClose} disabled={formLoading}>取消</Button>
          </Space>
        </div>

        {/* body */}
        <FaFlexRestLayout className='fa-full-content fa-p12 fa-bg-grey'>
          <div className='fa-content fa-full fa-relative fa-p12'>
            <FaFlowForm
              form={form}
              formId={flowForm.id}
              onSuccess={handleFormSubmit}
              onLoadingChange={setFormLoading}
            />
          </div>
        </FaFlexRestLayout>
      </div>
    );
  }, [open, flowForm, formLoading, form, handleClose, handleSubmit, handleFormSubmit]);

  const mountNode = document.querySelector('.fa-main')!;

  return (
    <div>
      <Button type="primary" onClick={handleAdd} icon={<PlusOutlined />}>新增</Button>

      {content && createPortal(content, mountNode)}
    </div>
  );
}