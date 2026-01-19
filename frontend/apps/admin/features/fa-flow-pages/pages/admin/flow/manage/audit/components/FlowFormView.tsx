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
  currentNode?: string;
  disabled?: boolean;
}

export default function FlowFormView({ flwProcess, formValues, currentNode, disabled }: FlowFormViewProps) {
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
      {flowProcess?.formType === FlowEnums.FlowProcessFormType.CUSTOM && (
        <FaFlowForm
          form={form}
          formId={formValues['_formId']}
          flowNode={flwNode}
          record={formValues}
          disabled={disabled}
          // onSuccess={(fv) => handleFormSubmit(flow, fv)}
          // onLoadingChange={setFormLoading}
        />
      )}
    </div>
  )
}
