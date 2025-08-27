import React, { useState, useEffect } from 'react';
import { FaFlexRestLayout, FaLazyContainer, Fa } from '@fa/ui';
import FlowAuditStart from './cube/FlowAuditStart';
import { Segmented } from 'antd';
import { AuditOutlined, BookOutlined, CarryOutOutlined, ContainerOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';
import FlowTodo from './cube/FlowTodo';
import { flowTaskApi } from '@features/fa-flow-pages/services';
import { Flow } from '@features/fa-flow-pages/types';


export default function FlowAudit() {
  const [tab, setTab] = useState('start');
  const [taskCounts, setTaskCounts] = useState<Flow.FlowTaskCountRet | null>(null);

  useEffect(() => {
    // 获取任务数量统计
    flowTaskApi.getMyTaskCount().then((res) => {
      if (res && res.status === Fa.RES_CODE.OK && res.data) {
        setTaskCounts(res.data);
      }
    });
  }, []);

  // 格式化标签名称，如果数量 > 0 则显示数量
  const formatLabel = (baseLabel: string, count?: number) => {
    if (count && count > 0) {
      return `${baseLabel} (${count})`;
    }
    return baseLabel;
  };

  return (
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
          onChange={(value) => {
            setTab(value as string);
          }}
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
          <div>我的申请内容</div>
        </FaLazyContainer>

        <FaLazyContainer showCond={tab === 'myReceive'}>
          <div>我收到的内容</div>
        </FaLazyContainer>

        <FaLazyContainer showCond={tab === 'claim'}>
          <div>认领任务内容</div>
        </FaLazyContainer>

        <FaLazyContainer showCond={tab === 'audited'}>
          <div>已审批内容</div>
        </FaLazyContainer>
      </FaFlexRestLayout>
    </div>
  )
}
