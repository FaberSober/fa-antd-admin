import React, { useState } from 'react';
import { FaFlexRestLayout, FaLazyContainer } from '@fa/ui';
import FlowAuditStart from './cube/FlowAuditStart';
import { Segmented } from 'antd';
import { AuditOutlined, BookOutlined, CarryOutOutlined, ContainerOutlined, SafetyCertificateOutlined, SendOutlined, SettingOutlined } from '@ant-design/icons';


export default function FlowAudit() {
  const [tab, setTab] = useState('start');

  return (
    <div className='fa-full-content-p12 fa-flex-column'>
      <div className='fa-mb12'>
        <Segmented
          options={[
            {
              label: '发起流程',
              value: 'start',
              icon: <SettingOutlined />,
            },
            {
              label: '待审批',
              value: 'todo',
              icon: <AuditOutlined />,
            },
            {
              label: '我的申请',
              value: 'myStart',
              icon: <SendOutlined />,
            },
            {
              label: '我收到的',
              value: 'myReceive',
              icon: <BookOutlined />,
            },
            {
              label: '认领任务',
              value: 'claim',
              icon: <ContainerOutlined />,
            },
            {
              label: '已审批',
              value: 'audited',
              icon: <CarryOutOutlined />,
            },
          ]}
          onChange={(value) => {
            console.log(value); // string
          }}
        />
      </div>

      <FaFlexRestLayout>
        <FaLazyContainer showCond={tab === 'start'}>
          <FlowAuditStart />
        </FaLazyContainer>

      </FaFlexRestLayout>
    </div>
  )
}
