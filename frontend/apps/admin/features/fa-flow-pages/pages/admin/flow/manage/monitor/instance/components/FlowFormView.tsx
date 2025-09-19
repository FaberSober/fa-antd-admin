import DemoFlowLeaveForm from '@features/fa-flow-pages/pages/admin/demo/flow/form/leave/modal/DemoFlowLeaveForm';
import { Flow } from '@features/fa-flow-pages/types';
import { Form } from 'antd';
import React from 'react'


interface FlowFormViewProps {
  flwProcess: Flow.FlwProcess;
  formValues: any;
}

export default function FlowFormView({ flwProcess, formValues }: FlowFormViewProps) {
  const [form] = Form.useForm();
  return (
    <div>
      {flwProcess.processKey.startsWith('testLeave') && (<DemoFlowLeaveForm form={form} record={formValues} disabled />)}
    </div>
  )
}
