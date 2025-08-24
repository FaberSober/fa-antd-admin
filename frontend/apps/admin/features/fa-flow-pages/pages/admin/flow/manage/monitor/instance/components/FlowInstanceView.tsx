import { flowProcessApi } from '@/services';
import { Flow } from '@/types';
import { ApartmentOutlined, FormOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaLazyContainer, PageLoading } from '@fa/ui';
import { FaWorkFlow } from '@features/fa-flow-pages/components';
import { Segmented } from 'antd';
import { isNil } from 'lodash';
import { useEffect, useState } from 'react';
import FlowFormView from './FlowFormView';


interface FlowInstanceViewProps {
  instance: Flow.FlwInstance;
}

export default function FlowInstanceView({ instance }: FlowInstanceViewProps) {
  const [tab, setTab] = useState('form');
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
    <div className='fa-full-content-p12 fa-flex-column'>
      <div className='fa-mb12'>
        <Segmented
          options={[
            { label: '审批信息', value: 'form', icon: <FormOutlined /> },
            { label: '流程图', value: 'workflow', icon: <ApartmentOutlined /> },
          ]}
          value={tab}
          onChange={(value) => {
            setTab(value as string);
          }}
        />
      </div>

      <FaFlexRestLayout>
        <FaLazyContainer showCond={tab === 'form'}>
          <FlowFormView flwProcess={info.flwProcess} formValues={JSON.parse(info.formContent || '{}')} />
        </FaLazyContainer>
        <FaLazyContainer showCond={tab === 'workflow'}>
          <FaWorkFlow processModel={JSON.parse(info.flwProcess.modelContent)} renderNodes={info.renderNodes} showLegends />
        </FaLazyContainer>
      </FaFlexRestLayout>
    </div>
  )
}
