import { flowProcessApi, flowTaskApi } from '@/services';
import { Flow } from '@/types';
import { ApartmentOutlined, CheckOutlined, CloseOutlined, CommentOutlined, FormOutlined, HistoryOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaLazyContainer, FaUtils, PageLoading } from '@fa/ui';
import { FaWorkFlow, FaFlowTaskTimeline } from '@features/fa-flow-pages/components';
import { Button, message, Modal, Segmented, Space, Splitter, Typography } from 'antd';
import { isNil } from 'lodash';
import { useEffect, useState } from 'react';
import FlowFormView from './FlowFormView';
import { useFlowAuditContext } from '../contexts/FlowAuditContext';


interface FlowInstanceViewProps {
  instanceId: string;
  // taskId: string;
  onSuccess?: () => void;
  type?: 'audit' | 'view' | 'claim'; // 审批 or 查看 or 认领
}

export default function FlowInstanceView({ instanceId, onSuccess, type = 'view' }: FlowInstanceViewProps) {
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

  if (isNil(info)) return <PageLoading />
  return (
    <div className='fa-full-content-p12 fa-flex-column' style={{right: 0}}>
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
          <div className='fa-full-content fa-flex-row fa-scroll-hidden'>
            {/* 左侧展示流程对应的业务表单 */}
            <Splitter>
              <Splitter.Panel>
              <div className='fa-full fa-flex-column fa-pr12 fa-relative'>
                {/* <Space>
                  <Button onClick={() => message.info('TODO')} icon={<CommentOutlined />}>评论</Button>
                  {type === 'audit' && taskId && <Button onClick={() => handlePass()} icon={<CheckOutlined />} type='primary'>同意</Button>}
                  {type === 'audit' && taskId && <Button onClick={() => handleReject()} icon={<CloseOutlined />} type='primary' danger>拒绝</Button>}
                  {type === 'claim' && taskId && <Button onClick={() => handleClaim()} icon={<CheckOutlined />} variant="solid" color="cyan">认领</Button>}
                </Space> */}

                <FaFlexRestLayout>
                  <FlowFormView flwProcess={info.flwProcess} formValues={JSON.parse(info.formContent || '{}')} currentNode={info.currentTask?.taskKey} disabled />
                </FaFlexRestLayout>
              </div>
              </Splitter.Panel>

              {/* 右侧展示流程的审批时间轴 */}
              <Splitter.Panel defaultSize={300} min={240} max="50%" collapsible>
                <div style={{width: '100%', paddingLeft: 12}} className='fa-flex-column'>
                  <Typography.Title level={5} style={{ marginBottom: 24, marginTop: 0 }}>审批记录</Typography.Title>
                  <FaFlowTaskTimeline processApprovals={info.processApprovals} />
                </div>
              </Splitter.Panel>
            </Splitter>
          </div>
        </FaLazyContainer>
        <FaLazyContainer showCond={tab === 'workflow'}>
          <FaWorkFlow flowProcess={info.flowProcess} processModel={JSON.parse(info.modelContent)} renderNodes={info.renderNodes} showLegends readOnly />
        </FaLazyContainer>
      </FaFlexRestLayout>
    </div>
  )
}
