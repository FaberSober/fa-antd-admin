import { flowProcessApi } from '@/services';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FaFlexRestLayout } from '@fa/ui';
import { FaFlowFormCreate, FaWorkFlow } from '@features/fa-flow-pages/components';
import { Flow } from '@features/fa-flow-pages/types';
import { Button, Space, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import FlowInstanceView from '../../../../audit/components/FlowInstanceView';

export interface FlowFormViewProps {
  flowForm: Flow.FlowForm;
  record: any;
  children?: React.ReactNode;
}

/**
 * 流程表单查看组件
 * @author xu.pengfei
 * @date 2026-02-05 16:39:50
 */
export default function FlowFormView({ flowForm, record, children }: FlowFormViewProps) {
  const [open, setOpen] = useState(false);
  const [flowProcess, setFlowProcess] = useState<Flow.FlowProcess>();
  
  useEffect(() => {
    if (!flowForm.flowProcessId) return;
    flowProcessApi.getById(flowForm.flowProcessId).then(res => {
      setFlowProcess(res.data)
    })
  }, [flowForm.flowProcessId]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const content = React.useMemo(() => {
    if (!open) return null;
    
    return (
      <div className='fa-full-content fa-bg-white fa-flex-column fa-tabs' style={{ zIndex: 999 }}>
        {/* header */}
        <div className='fa-flex-row-center fa-border-b fa-p12'>
          <Button color="default" variant="text" onClick={handleClose} icon={<ArrowLeftOutlined />} />
          <div className='fa-h3'>详情</div>
          <div className='fa-flex-1' />
          <Space>
            <Button onClick={handleClose}>关闭</Button>
          </Space>
        </div>

        {/* body */}
        <FaFlexRestLayout>
          <FlowInstanceView instanceId={record.flowInstanceId} />
        </FaFlexRestLayout>
      </div>
    );
  }, [open, flowForm, record, flowProcess]);

  const mountNode = document.querySelector('.fa-main')!;

  return (
    <div>
      <span onClick={() => setOpen(true)}>{children}</span>

      {content && createPortal(content, mountNode)}
    </div>
  );
}