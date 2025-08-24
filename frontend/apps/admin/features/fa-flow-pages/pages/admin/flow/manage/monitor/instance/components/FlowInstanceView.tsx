import { flowProcessApi } from '@/services';
import { Flow } from '@/types'
import { PageLoading } from '@fa/ui';
import { FaWorkFlow } from '@features/fa-flow-pages/components';
import { isNil } from 'lodash';
import React, { useEffect, useState } from 'react'


interface FlowInstanceViewProps {
  instance: Flow.FlwInstance;
}

export default function FlowInstanceView({ instance }: FlowInstanceViewProps) {

  const [info, setInfo] = useState<Flow.FlowApprovalInfo>()

  useEffect(() => {
    getInfo()
  }, [instance])

  function getInfo() {
    // 获取流程实例详情
    flowProcessApi.getApprovalInfoById(instance.id).then(res => {
      setInfo(res.data)
    })
  }

  if (isNil(info)) return <PageLoading />
  return (
    <div className='fa-full-content-p12'>
      <FaWorkFlow processModel={JSON.parse(info.modelContent)} />
    </div>
  )
}
