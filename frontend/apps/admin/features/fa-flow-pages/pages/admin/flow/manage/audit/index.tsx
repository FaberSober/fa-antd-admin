import React, { useState, useEffect, useCallback } from 'react';
import { FaFlexRestLayout, FaLazyContainer, Fa } from '@fa/ui';
import FlowAuditStart from './cube/FlowAuditStart';
import { Segmented } from 'antd';
import { AuditOutlined, BookOutlined, CarryOutOutlined, ContainerOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import useBus from "use-bus";
import FlowTodo from './cube/FlowTodo';
import FlowMyApplications from './cube/FlowMyApplications';
import FlowMyReceived from './cube/FlowMyReceived';
import FlowPendingClaim from './cube/FlowPendingClaim';
import FlowMyApproved from './cube/FlowMyApproved';
import { flowTaskApi } from '@features/fa-flow-pages/services';
import { Flow } from '@features/fa-flow-pages/types';
import { FlowAuditProvider } from './contexts/FlowAuditContext';


export default function FlowAudit() {
  const [tab, setTab] = useState('start');
  const [taskCounts, setTaskCounts] = useState<Flow.FlowTaskCountRet | null>(null);

  // 获取任务数量统计
  const getTaskCounts = useCallback(() => {
    flowTaskApi.getMyTaskCount().then((res) => {
      if (res && res.status === Fa.RES_CODE.OK && res.data) {
        setTaskCounts(res.data);
      }
    });
  }, []);

  useEffect(() => {
    getTaskCounts();
  }, [getTaskCounts]);

  // 接收websocket处理组件FlowTaskWebsocketProcessor发布的刷新任务数量信息
  useBus(
    ['@@api/FLOW/REFRESH_TASK_COUNT'],
    () => getTaskCounts(),
    [],
  )

  // 刷新任务数量统计的方法
  const handleRefreshCount = useCallback(() => {
    getTaskCounts();
  }, [getTaskCounts]);

  // 格式化标签名称，如果数量 > 0 则显示数量
  const formatLabel = (baseLabel: string, count?: number) => {
    if (count && count > 0) {
      return `${baseLabel} (${count})`;
    }
    return baseLabel;
  };

  return (
    <FlowAuditProvider onRefreshCount={handleRefreshCount}>
      <div className='fa-full-content-p12 fa-flex-column'>
        <div className='fa-mb12'>
          <Segmented
            options={[
              { label: '发起流程', value: 'start', icon: <SettingOutlined /> },
              {
                label: formatLabel('待审批', taskCounts?.pendingApprovalCount),
                value: 'todo',
                icon: <AuditOutlined />
              },
              {
                label: formatLabel('我的申请', taskCounts?.myApplicationCount),
                value: 'myStart',
                icon: <SendOutlined />
              },
              {
                label: formatLabel('我收到的', taskCounts?.myReceivedCount),
                value: 'myReceive',
                icon: <BookOutlined />
              },
              {
                label: formatLabel('认领任务', taskCounts?.claimTaskCount),
                value: 'claim',
                icon: <ContainerOutlined />
              },
              {
                label: formatLabel('已审批', taskCounts?.auditedCount),
                value: 'audited',
                icon: <CarryOutOutlined />
              },
            ]}
            value={tab}
            onChange={setTab}
          />
        </div>

        <FaFlexRestLayout>
          <FaLazyContainer showCond={tab === 'start'}>
            <FlowAuditStart />
          </FaLazyContainer>

          <FaLazyContainer showCond={tab === 'todo'}>
            <FlowTodo />
          </FaLazyContainer>

          <FaLazyContainer showCond={tab === 'myStart'}>
            <FlowMyApplications />
          </FaLazyContainer>

          <FaLazyContainer showCond={tab === 'myReceive'}>
            <FlowMyReceived />
          </FaLazyContainer>

          <FaLazyContainer showCond={tab === 'claim'}>
            <FlowPendingClaim />
          </FaLazyContainer>

          <FaLazyContainer showCond={tab === 'audited'}>
            <FlowMyApproved />
          </FaLazyContainer>
        </FaFlexRestLayout>
      </div>
    </FlowAuditProvider>
  )
}
