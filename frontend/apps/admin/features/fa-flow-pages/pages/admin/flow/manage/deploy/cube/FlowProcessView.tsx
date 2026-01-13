import { ApartmentOutlined, FormOutlined } from '@ant-design/icons';
import { FaFlexRestLayout, FaLazyContainer } from '@fa/ui';
import { FaWorkFlow } from '@features/fa-flow-pages/components';
import { Flow } from '@features/fa-flow-pages/types';
import { Segmented } from 'antd';
import React, { useState } from 'react';
import FlowProcessEdit from './FlowProcessEdit';

export interface FlowProcessViewProps {
  item: Flow.FlowProcess;
}

/**
 * @author xu.pengfei
 * @date 2025-09-17 11:15:46
 */
export default function FlowProcessView({ item }: FlowProcessViewProps) {
  const [tab, setTab] = useState('basic');

  return (
    <div className='fa-full-content-p12 fa-flex-column'>
      <div className='fa-mb12'>
        <Segmented
          options={[
            { label: '基本信息', value: 'basic', icon: <FormOutlined /> },
            { label: '流程配置', value: 'workflow', icon: <ApartmentOutlined /> },
          ]}
          value={tab}
          onChange={(value) => {
            setTab(value as string);
          }}
        />
      </div>

      <FaFlexRestLayout>
        <FaLazyContainer showCond={tab === 'basic'}>
          <FlowProcessEdit item={item} viewOnly />
        </FaLazyContainer>
        <FaLazyContainer showCond={tab === 'workflow'}>
          <FaWorkFlow flowProcess={item} processModel={JSON.parse(item.modelContent)} readOnly />
        </FaLazyContainer>
      </FaFlexRestLayout>
    </div>
  );
}
