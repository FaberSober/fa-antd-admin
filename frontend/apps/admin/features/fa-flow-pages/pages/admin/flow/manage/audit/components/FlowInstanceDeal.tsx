import { flowProcessApi, flowTaskApi } from '@/services';
import { Flow } from '@/types';
import { ApartmentOutlined, CheckOutlined, CloseOutlined, CommentOutlined, FormOutlined, HistoryOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaLazyContainer, FaUtils, PageLoading } from '@fa/ui';
import { FaWorkFlow, FaFlowTaskTimeline } from '@features/fa-flow-pages/components';
import { Button, message, Modal, Segmented, Space, Typography } from 'antd';
import { isNil } from 'lodash';
import { useEffect, useState } from 'react';
import FlowFormView from './FlowFormView';
import { useFlowAuditContext } from '../contexts/FlowAuditContext';


interface FlowInstanceDealProps {
  instanceId: string;
  taskId?: string;
  onSuccess?: () => void;
}

export default function FlowInstanceDeal({ instanceId, taskId, onSuccess }: FlowInstanceDealProps) {
  const { refreshCount } = useFlowAuditContext();
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
        return flowTaskApi.pass({ taskId: taskId! }).then(res => {
          FaUtils.showResponse(res, '同意流程')
          onSuccess?.();
          refreshCount();
        })
      }
    })
  }

  function handleReject() {
    Modal.confirm({
      title: '请确认是否拒绝?',
      okText: '拒绝',
      okButtonProps: {danger: true},
      onOk: () => {
        return flowTaskApi.reject({ taskId: taskId! }).then(res => {
          FaUtils.showResponse(res, '拒绝流程')
          onSuccess?.();
          refreshCount();
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
          <div className='fa-full-content fa-flex-row'>
            {/* 左侧展示流程对应的业务表单 */}
            <div className='fa-flex-1'>
              <FlowFormView flwProcess={info.flwProcess} formValues={JSON.parse(info.formContent || '{}')} />
              <Space>
                <Button onClick={() => message.info('TODO')} icon={<CommentOutlined />}>评论</Button>
                {taskId && <Button onClick={() => handlePass()} icon={<CheckOutlined />} type='primary'>同意</Button>}
                {taskId && <Button onClick={() => handleReject()} icon={<CloseOutlined />} type='primary' danger>拒绝</Button>}
              </Space>
            </div>

            {/* 右侧展示流程的审批时间轴 */}
            <div style={{width: 300, paddingLeft: 16, borderLeft: '1px solid #f0f0f0'}} className='fa-flex-column'>
              <Typography.Title level={5} style={{ marginBottom: 16 }}>审批记录</Typography.Title>
              <FaFlowTaskTimeline processApprovals={info.processApprovals} />
            </div>
          </div>
        </FaLazyContainer>
        <FaLazyContainer showCond={tab === 'workflow'}>
          <FaWorkFlow processModel={JSON.parse(info.modelContent)} renderNodes={info.renderNodes} showLegends readOnly />
        </FaLazyContainer>
      </FaFlexRestLayout>
    </div>
  )
}
