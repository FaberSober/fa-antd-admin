import { flowProcessApi, flowTaskApi } from '@/services';
import { Flow } from '@/types';
import { ApartmentOutlined, CheckOutlined, CloseOutlined, CommentOutlined, FormOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaLazyContainer, FaUtils, PageLoading } from '@fa/ui';
import { FaWorkFlow } from '@features/fa-flow-pages/components';
import { Button, message, Modal, Segmented, Space } from 'antd';
import { isNil } from 'lodash';
import { useEffect, useState } from 'react';
import FlowFormView from './FlowFormView';


interface FlowInstanceDealProps {
  instanceId: string;
  taskId: string;
  onSuccess?: () => void;
}

export default function FlowInstanceDeal({ instanceId, taskId, onSuccess }: FlowInstanceDealProps) {
  const [tab, setTab] = useState('form');
  const [info, setInfo] = useState<Flow.FlowApprovalInfo>()

  useEffect(() => {
    getInfo()
  }, [instanceId])

  function getInfo() {
    // 获取流程实例详情
    flowProcessApi.getApprovalInfoById(instanceId).then(res => {
      setInfo(res.data)
    })
  }

  function handlePass() {
    Modal.confirm({
      title: '请确认是否通过?',
      onOk: () => {
        flowTaskApi.pass({ taskId }).then(res => {
          FaUtils.showResponse(res, '同意流程')
          onSuccess?.();
        })
      }
    })
  }

  function handleReject() {
    Modal.confirm({
      title: '请确认是否拒绝?',
      onOk: () => {
        flowTaskApi.reject({ taskId }).then(res => {
          FaUtils.showResponse(res, '拒绝流程')
          onSuccess?.();
        })
      }
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
          <Space>
            <Button onClick={() => message.info('TODO')} icon={<CommentOutlined />}>评论</Button>
            <Button onClick={() => handlePass()} icon={<CheckOutlined />} type='primary'>同意</Button>
            <Button onClick={() => handleReject()} icon={<CloseOutlined />} type='primary' danger>拒绝</Button>
          </Space>
        </FaLazyContainer>
        <FaLazyContainer showCond={tab === 'workflow'}>
          <FaWorkFlow processModel={JSON.parse(info.modelContent)} renderNodes={info.renderNodes} showLegends />
        </FaLazyContainer>
      </FaFlexRestLayout>
    </div>
  )
}
