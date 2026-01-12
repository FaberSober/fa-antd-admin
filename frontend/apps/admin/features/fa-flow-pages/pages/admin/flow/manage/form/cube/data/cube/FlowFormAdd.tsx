import { flowProcessApi } from '@/services';
import { Flow } from '@/types';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { FaFlexRestLayout } from '@fa/ui';
import { FaWorkFlow } from '@features/fa-flow-pages/components';
import { Button, Space, Tabs } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';


export interface FlowFormAddProps {
  flowForm: Flow.FlowForm;
}

/**
 * @author xu.pengfei
 * @date 2026-01-12 15:50:13
 */
export default function FlowFormAdd({ flowForm }: FlowFormAddProps) {
  const [open, setOpen] = useState(false);
  const [flow, setFlow] = useState<Flow.FlowProcess>();

  useEffect(() => {
    flowProcessApi.getById(flowForm.flowProcessId).then(res => {
      setFlow(res.data)
    })
  }, [flowForm.flowProcessId]);

  function handleSubmit() {
    setOpen(false);
  }

  function handleAdd() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const content = open ? (
    <div className='fa-full-content fa-bg-white fa-flex-column fa-tabs' style={{ zIndex: 999 }}>
      {/* header */}
      <div className='fa-flex-row-center fa-border-b fa-p12'>
        <Button color="default" variant="text" onClick={handleClose} icon={<ArrowLeftOutlined />} />
        <div className='fa-h3'>新增</div>
        <div className='fa-flex-1' />
        <Space>
          <Button onClick={handleSubmit} type='primary'>提交</Button>
          <Button onClick={handleClose}>取消</Button>
        </Space>
      </div>

      {/* body */}
      <FaFlexRestLayout>
        <Tabs
          className=''
          items={[
            {
              label: '表单信息',
              key: 'form',
              children: (
                <div className='fa-full'>
                  11
                </div>
              ),
            },
            {
              label: '流程信息',
              key: 'workflow',
              children: (
                <div className='fa-full'>
                  {flow && <FaWorkFlow flowProcess={flow} processModel={JSON.parse(flow.modelContent)} readOnly />}
                </div>
              ),
            },
          ]}
          tabBarStyle={{ paddingLeft: 12 }}
        />
      </FaFlexRestLayout>
    </div>
  ) : null

  // 重点在这里 ↓↓↓
  const mountNode = document.querySelector('.fa-main')!;

  return (
    <div>
      <Button onClick={handleAdd} icon={<PlusOutlined />}>新增</Button>

      {content && createPortal(content, mountNode)}
    </div>
  );
}
