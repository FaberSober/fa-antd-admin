import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaUtils, Fa } from '@fa/ui';
import { FaFlowForm } from '@features/fa-flow-pages/components';
import { Button, Form, Space } from 'antd';
import { mapKeys, snakeCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface FormEditProps {
  flowForm: Flow.FlowForm;
  record: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  children?: React.ReactElement;
}

/**
 * 简单表单编辑页面
 * @author xu.pengfei
 * @date 2026-02-06 11:10:22
 */
export default function FormEdit({ flowForm, record, open: openProp, onOpenChange, onSuccess, onPrev, onNext, hasPrev, hasNext, children }: FormEditProps) {
  const [openInternal, setOpenInternal] = useState(false);
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // 支持受控和非受控两种模式
  const open = openProp !== undefined ? openProp : openInternal;
  const setOpen = onOpenChange || setOpenInternal;

  useEffect(() => {
    if (!open || !record) return;
    
    // 将record的key从驼峰形式转换为下划线形式
    const snakeCaseRecord = mapKeys(record, (_, key) => snakeCase(key));
    form.setFieldsValue(snakeCaseRecord);
  }, [open, record, form]);

  const handleSubmit = React.useCallback(() => {
    form.submit();
  }, [form]);

  const handleFormSubmit = React.useCallback((formValues: any) => {
    setFormLoading(true);
    // 更新表单数据,在 formData 中包含 id 字段
    flowFormApi.saveFormData({
      formId: flowForm.id,
      formData: {
        ...formValues,
        id: record.id,
      },
    }).then((res: Fa.Ret) => {
      FaUtils.showResponse(res, '编辑');
      setOpen(false);
      form.resetFields();
      onSuccess?.();
    }).finally(() => {
      setFormLoading(false);
    });
  }, [flowForm.id, record, form, onSuccess, setOpen]);

  const handleOpen = React.useCallback(() => {
    setOpen(true);
  }, [setOpen]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    form.resetFields();
  }, [setOpen, form]);

  const content = React.useMemo(() => {
    if (!open) return null;
    
    return (
      <div className='fa-full-content fa-bg-white fa-flex-column' style={{ zIndex: 999 }}>
        {/* header */}
        <div className='fa-flex-row-center fa-border-b fa-p12'>
          <Button color="default" variant="text" onClick={handleClose} icon={<ArrowLeftOutlined />} />
          <div className='fa-h3'>编辑 - {flowForm.name}</div>
          <div className='fa-flex-1' />
          <Space>
            <Button onClick={onPrev} disabled={!hasPrev}>上一条</Button>
            <Button onClick={onNext} disabled={!hasNext}>下一条</Button>
            <Button onClick={handleSubmit} type='primary' loading={formLoading}>提交</Button>
            <Button onClick={handleClose} disabled={formLoading}>取消</Button>
          </Space>
        </div>

        {/* body */}
        <FaFlexRestLayout>
          <div className='fa-full fa-p12 fa-relative'>
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
  }, [open, flowForm, formLoading, form, handleClose, handleSubmit, handleFormSubmit, hasPrev, hasNext, onPrev, onNext]);

  const mountNode = document.querySelector('.fa-main')!;

  return (
    <>
      {children && React.cloneElement(children, { onClick: handleOpen })}
      {content && createPortal(content, mountNode)}
    </>
  );
}