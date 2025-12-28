import { flowFormApi } from '@/services';
import { Flow } from '@/types';
import { PageLoading } from '@fa/ui';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FlowFormDataTable from '../../manage/form/cube/data/FlowFormDataTable';


/**
 * fa flow form dynamic view page, based on form config.
 * @author xu.pengfei
 * @date 2025-12-27 21:53:39
 */
export default function FlowFormViewPage() {
  const { id } = useParams()
  const [flowForm, setFlowForm] = useState<Flow.FlowForm>();

  useEffect(() => {
    setFlowForm(undefined)
    flowFormApi.getById(id as any).then(res => {
      setFlowForm(res.data)
    })
    return () => {
      setFlowForm(undefined)
    }
  }, [id]);

  if (flowForm === undefined) return <PageLoading />

  return (
    <div>
      <FlowFormDataTable flowForm={flowForm} />
    </div>
  )
}
