import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaUtils, Fa } from '@fa/ui';
import { FaFlowForm } from '@features/fa-flow-pages/components';
import { Button, Form, Space, Spin } from 'antd';
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
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState<boolean>(false);

  // 支持受控和非受控两种模式
  const open = openProp !== undefined ? openProp : openInternal;
  const setOpen = onOpenChange || setOpenInternal;

  useEffect(() => {
    if (!open || !record) return;
    
    // 调用接口获取完整的表单数据（包含子表数据）
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await flowFormApi.getFormDataDetailById(flowForm.id, record.id);
        if (res.data) {
          // 直接使用原始数据，不进行转换
          form.setFieldsValue(res.data);
        }
      } catch (error) {
        console.error('Failed to fetch form data detail:', error);
        // 如果获取失败，使用传入的record数据作为备份
        form.setFieldsValue(record);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDetail();
  }, [open, record, form, flowForm.id]);

  const handleSubmit = React.useCallback(() => {
    form.submit();
  }, [form]);

  const handleFormSubmit = React.useCallback((formValues: any) => {
    setFormLoading(true);
    // 更新表单数据
    flowFormApi.updateFormData({
      formId: flowForm.id,
      formData: {
        ...formValues,
        id: record.id,
      },
    }).then((res: Fa.Ret) => {
      FaUtils.showResponse(res, '编辑');
      // setOpen(false);
      // form.resetFields();
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
        <Spin wrapperClassName='fa-spin-full' spinning={loading || formLoading}>
          {/* header */}
          <div className='fa-flex-row-center fa-border-b fa-p12'>
            <Space>
              <Button color="default" variant="text" onClick={handleClose} icon={<ArrowLeftOutlined />} />
              <div className='fa-h3'>编辑 - {flowForm.name}</div>
            </Space>
            <div className='fa-flex-1' />
            <Space>
              <Button onClick={onPrev} disabled={!hasPrev}>上一条</Button>
              <Button onClick={onNext} disabled={!hasNext}>下一条</Button>
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
        </Spin>
      </div>
    );
  }, [open, flowForm, loading, formLoading, form, handleClose, handleSubmit, handleFormSubmit, hasPrev, hasNext, onPrev, onNext]);

  const mountNode = document.querySelector('.fa-main')!;

  return (
    <>
      {children && React.cloneElement(children, { onClick: handleOpen })}
      {content && createPortal(content, mountNode)}
    </>
  );
}