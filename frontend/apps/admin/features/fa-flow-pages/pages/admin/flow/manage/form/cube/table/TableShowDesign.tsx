import { Flow } from '@/types';
import { FaFlexRestLayout } from '@fa/ui';
import { Tabs } from 'antd';
import React from 'react';

export interface TableShowDesignProps {
  item: Flow.FlowForm;
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 20:44:13
 */
export default function TableShowDesign({ item }: TableShowDesignProps) {
  return (
    <div className='fa-full-content fa-p12 fa-bg-grey fa-flex-row fa-gap12'>
      <FaFlexRestLayout className='fa-full-content fa-card'>

      </FaFlexRestLayout>

      <div style={{ width: 340 }} className='fa-card fa-p0 fa-tabs-block'>
        <Tabs
          items={[
            {
              key: 'query',
              label: '查询字段',
            },
            {
              key: 'column',
              label: '列表字段',
            },
            {
              key: 'tableProps',
              label: '列表属性',
            },
          ]}
          centered
          tabBarGutter={0}
          indicator={{ size: (origin) => origin, align: 'center' }}
        />
      </div>
    </div>
  );
}
