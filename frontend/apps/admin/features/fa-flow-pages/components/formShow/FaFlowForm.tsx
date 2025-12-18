import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import React, { useEffect, useState } from 'react';
import { isNil } from 'lodash';
import { PageLoading } from '@fa/ui';
import FaFormShow from './FaFormShow';

export interface FaFlowFormProps {
  formId: number;
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 11:28:43
 */
export default function FaFlowForm({ formId }: FaFlowFormProps) {
  const [flowForm, setFlowForm] = useState<Flow.FlowForm>();

  useEffect(() => {
    flowFormApi.getById(formId).then((res) => {
      setFlowForm(res.data);
    });
  }, [formId]);

  if (isNil(flowForm)) return <PageLoading />;
  return (
    <div>
      <FaFormShow config={flowForm.config} />
    </div>
  );
}
