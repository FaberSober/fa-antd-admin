import { flowProcessApi } from '@/services';
import { Flow, Flw } from '@/types';
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaUtils } from '@fa/ui';
import { FaFlowFormCreate, FaWorkFlow } from '@features/fa-flow-pages/components';
import { Button, Form, Space, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';


export interface FlowFormAddProps {
  flowForm: Flow.FlowForm;
  onSuccess?: () => void;
}

/**
 * @author xu.pengfei
 * @date 2026-01-12 15:50:13
 */
export default function FlowFormAdd({ flowForm, onSuccess }: FlowFormAddProps) {
  const [open, setOpen] = useState(false);
  const [flow, setFlow] = useState<Flow.FlowProcess>();
  const [form] = Form.useForm();
  const [formLoading, setFormLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!flowForm.flowProcessId) return;
    flowProcessApi.getById(flowForm.flowProcessId).then(res => {
      setFlow(res.data)
    })
  }, [flowForm.flowProcessId]);

  const handleSubmit = React.useCallback(() => {
    form.submit();
  }, [form]);

  const handleFormSubmit = React.useCallback((flow: Flow.FlowProcess, formValues: any) => {
    // start flow
    flowProcessApi.start({ processId: flow.id, processKey: flow.processKey, args: formValues }).then(res => {
      FaUtils.showResponse(res, '发起流程');
      setOpen(false);
      onSuccess?.();
    })
  }, [onSuccess]);

  const handleAdd = React.useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const processModel:Flw.ProcessModel = JSON.parse(flow ? flow.modelContent : '{}');
  const startNode = processModel.nodeConfig;

  const content = React.useMemo(() => {
    if (!open) return null;
    
    return (
      <div className='fa-full-content fa-bg-white fa-flex-column fa-tabs' style={{ zIndex: 999 }}>
        {/* header */}
        <div className='fa-flex-row-center fa-border-b fa-p12'>
          <Button color="default" variant="text" onClick={handleClose} icon={<ArrowLeftOutlined />} />
          <div className='fa-h3'>新增</div>
          <div className='fa-flex-1' />
          <Space>
            <Button onClick={handleSubmit} type='primary' loading={formLoading}>提交</Button>
            <Button onClick={handleClose} disabled={formLoading}>取消</Button>
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
                  <div className='fa-full fa-p12'>
                    {flow && (
                      <FaFlowFormCreate
                        form={form}
                        flow={flow}
                        startNode={startNode}
                        onFormSubmit={handleFormSubmit}
                        onLoadingChange={setFormLoading}
                      />
                    )}
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
    );
  }, [open, flow, formLoading, form, startNode, handleClose, handleSubmit, handleFormSubmit]);

  // 重点在这里 ↓↓↓
  const mountNode = document.querySelector('.fa-main')!;

  return (
    <div>
      {flow && <Button onClick={handleAdd} icon={<PlusOutlined />}>新增</Button>}

      {content && createPortal(content, mountNode)}
    </div>
  );
}
