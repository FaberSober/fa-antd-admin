import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FaFlexRestLayout } from '@fa/ui';
import { FaFlowForm } from '@features/fa-flow-pages/components';
import { Button, Form, Space, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface FormViewProps {
  flowForm: Flow.FlowForm;
  record: any;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  children?: React.ReactElement;
}

/**
 * 简单表单查看页面
 * @author xu.pengfei
 * @date 2026-02-06 11:21:18
 */
export default function FormView({ flowForm, record, open: openProp, onOpenChange, onPrev, onNext, hasPrev, hasNext, children }: FormViewProps) {
  const [openInternal, setOpenInternal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

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
          console.log('=== FormView fetchDetail ===');
          console.log('原始数据:', res.data);
          
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
        <Spin wrapperClassName='fa-spin-full' spinning={loading}>
          {/* header */}
          <div className='fa-flex-row-center fa-border-b fa-p12'>
            <Space>
              <Button color="default" variant="text" onClick={handleClose} icon={<ArrowLeftOutlined />} />
              <div className='fa-h3'>查看 - {flowForm.name}</div>
            </Space>
            <div className='fa-flex-1' />
            <Space>
              <Button onClick={onPrev} disabled={!hasPrev}>上一条</Button>
              <Button onClick={onNext} disabled={!hasNext}>下一条</Button>
              <Button onClick={handleClose}>关闭</Button>
            </Space>
          </div>

          {/* body */}
          <FaFlexRestLayout>
            <div className='fa-full fa-p12 fa-relative'>
              <FaFlowForm
                form={form}
                formId={flowForm.id}
                disabled
              />
            </div>
          </FaFlexRestLayout>
        </Spin>
      </div>
    );
  }, [open, flowForm, form, handleClose, hasPrev, hasNext, onPrev, onNext, loading]);

  const mountNode = document.querySelector('.fa-main')!;

  return (
    <>
      {children && React.cloneElement(children, { onClick: handleOpen })}
      {content && createPortal(content, mountNode)}
    </>
  );
}