import { flowProcessApi } from '@/services';
import { FaFlowForm, FlowUtils } from '@features/fa-flow-pages/components';
import DemoFlowLeaveForm from '@features/fa-flow-pages/pages/admin/demo/flow/form/leave/modal/DemoFlowLeaveForm';
import { Flow, FlowEnums } from '@features/fa-flow-pages/types';
import { Form } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';


interface FlowFormViewProps {
  flwProcess: Flow.FlwProcess;
  formValues: any;
  /** 当前节点 */
  currentNode: string;
}

export default function FlowFormView({ flwProcess, formValues, currentNode }: FlowFormViewProps) {
  const [form] = Form.useForm();
  const [flowProcess, setFlowProcess] = useState<Flow.FlowProcess>();

  useEffect(() => {
    flowProcessApi.getByKey(flwProcess.processKey).then(res => {
      setFlowProcess(res.data)
    })
  }, [flwProcess.processKey]);

  const flwNode = useMemo(() => {
    if (!flwProcess || !currentNode) return undefined;
    const processModel = FlowUtils.getProcessModel(flwProcess);
    return FlowUtils.getNodeConfigByKey(processModel, currentNode);
  }, [flwProcess, currentNode]);

  console.log('flowProcess', flowProcess, 'formValues', formValues, 'flwNode', flwNode);
  return (
    <div>
      {/* 系统表单 */}
      {flwProcess.processKey.startsWith('testLeave') && (<DemoFlowLeaveForm form={form} record={formValues} disabled />)}
      {/* 自定义表单 */}
      {flowProcess?.formType === FlowEnums.FlowProcessFormType.CUSTOM && flwNode && (
        <FaFlowForm
          form={form}
          formId={formValues.formId}
          flowNode={flwNode}
          record={formValues.formData}
          // onSuccess={(fv) => handleFormSubmit(flow, fv)}
          // onLoadingChange={setFormLoading}
        />
      )}
    </div>
  )
}
