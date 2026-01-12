import { Flow, FlowEnums, Flw } from '@/types';
import DemoFlowLeaveForm from '@features/fa-flow-pages/pages/admin/demo/flow/form/leave/modal/DemoFlowLeaveForm';
import React from 'react';
import FaFlowForm from './FaFlowForm';
import { FormInstance } from 'antd';

export interface FaFlowFormCreateProps {
  flow: Flow.FlowProcess;
  form: FormInstance<any>;
  startNode: Flw.Node;
  onFormSubmit: (flow: Flow.FlowProcess, formValues: any) => void;
  onLoadingChange?: (loading: boolean) => void;
}

/**
 * @author xu.pengfei
 * @date 2026-01-12 17:15:23
 */
export default function FaFlowFormCreate({ flow, form, startNode, onFormSubmit, onLoadingChange }: FaFlowFormCreateProps) {
  return (
    <div>
      {/* 系统表单 */}
      {flow.processKey.startsWith('testLeave') && (<DemoFlowLeaveForm form={form} onSuccess={(fv) => onFormSubmit(flow, fv)} onLoadingChange={onLoadingChange} />)}
      {/* 自定义表单 */}
      {flow.formType === FlowEnums.FlowProcessFormType.CUSTOM && (
        <div className='fa-full-content'>
          <FaFlowForm
            formId={flow.formId}
            form={form}
            flowNode={startNode}
            onSuccess={(fv) => onFormSubmit(flow, fv)}
            onLoadingChange={onLoadingChange}
          />
        </div>
      )}
    </div>
  );
}
