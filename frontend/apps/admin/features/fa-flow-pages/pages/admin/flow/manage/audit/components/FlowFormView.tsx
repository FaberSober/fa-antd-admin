import { flowProcessApi } from '@/services';
import { FaFlowForm } from '@features/fa-flow-pages/components';
import DemoFlowLeaveForm from '@features/fa-flow-pages/pages/admin/demo/flow/form/leave/modal/DemoFlowLeaveForm';
import { Flow, FlowEnums } from '@features/fa-flow-pages/types';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';


interface FlowFormViewProps {
  flwProcess: Flow.FlwProcess;
  formValues: any;
}

export default function FlowFormView({ flwProcess, formValues }: FlowFormViewProps) {
  const [form] = Form.useForm();
  const [flowProcess, setFlowProcess] = useState<Flow.FlowProcess>();

  useEffect(() => {
    flowProcessApi.getByKey(flwProcess.processKey).then(res => {
      setFlowProcess(res.data)
    })
  }, [flwProcess.processKey]);

  console.log('flowProcess', flowProcess, 'formValues', formValues);
  return (
    <div>
      {/* 系统表单 */}
      {flwProcess.processKey.startsWith('testLeave') && (<DemoFlowLeaveForm form={form} record={formValues} disabled />)}
      {/* 自定义表单 */}
      {flowProcess?.formType === FlowEnums.FlowProcessFormType.CUSTOM && (
        <FaFlowForm
          form={form}
          formId={formValues.formId}
          record={formValues.formData}
          // onSuccess={(fv) => handleFormSubmit(flow, fv)}
          // onLoadingChange={setFormLoading}
        />
      )}
    </div>
  )
}
