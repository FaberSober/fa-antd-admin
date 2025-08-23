import React, { useState } from 'react';
import { FaFlexRestLayout, FaLazyContainer } from '@fa/ui';
import FlowAuditStart from './cube/FlowAuditStart';
import { Segmented } from 'antd';
import { AuditOutlined, BookOutlined, CarryOutOutlined, ContainerOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';


export default function FlowAudit() {
  const [tab, setTab] = useState('start');

  return (
    <div className='fa-full-content-p12 fa-flex-column'>
      <div className='fa-mb12'>
        <Segmented
          options={[
            { label: '发起流程', value: 'start', icon: <SettingOutlined /> },
            { label: '待审批', value: 'todo', icon: <AuditOutlined /> },
            { label: '我的申请', value: 'myStart', icon: <SendOutlined /> },
            { label: '我收到的', value: 'myReceive', icon: <BookOutlined /> },
            { label: '认领任务', value: 'claim', icon: <ContainerOutlined /> },
            { label: '已审批', value: 'audited', icon: <CarryOutOutlined /> },
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
          <div>待审批内容</div>
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
