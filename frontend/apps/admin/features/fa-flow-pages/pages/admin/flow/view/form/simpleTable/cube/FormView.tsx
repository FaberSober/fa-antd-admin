import { Flow } from '@/types';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FaFlexRestLayout } from '@fa/ui';
import { FaFlowForm } from '@features/fa-flow-pages/components';
import { Button, Form } from 'antd';
import { mapKeys, snakeCase } from 'lodash';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

export interface FormViewProps {
  flowForm: Flow.FlowForm;
  record: any;
  children?: React.ReactElement;
}

/**
 * 简单表单查看页面
 * @author xu.pengfei
 * @date 2026-02-06 11:21:18
 */
export default function FormView({ flowForm, record, children }: FormViewProps) {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open || !record) return;
    
    // 将record的key从驼峰形式转换为下划线形式
    const snakeCaseRecord = mapKeys(record, (_, key) => snakeCase(key));
    console.log('snakeCaseRecord', snakeCaseRecord)
    form.setFieldsValue(snakeCaseRecord);
  }, [open, record, form]);

  const handleOpen = React.useCallback(() => {
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
          <Button color="default" variant="text" onClick={handleClose} icon={<ArrowLeftOutlined />} />
          <div className='fa-h3'>查看 - {flowForm.name}</div>
          <div className='fa-flex-1' />
          <Button onClick={handleClose}>关闭</Button>
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
      </div>
    );
  }, [open, flowForm, form, handleClose]);

  const mountNode = document.querySelector('.fa-main')!;

  return (
    <>
      {children && React.cloneElement(children, { onClick: handleOpen })}
      {content && createPortal(content, mountNode)}
    </>
  );
}