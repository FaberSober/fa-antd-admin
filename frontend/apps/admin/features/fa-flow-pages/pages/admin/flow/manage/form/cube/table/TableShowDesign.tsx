import { Flow } from '@/types';
import { FaFlexRestLayout } from '@fa/ui';
import { Divider, Tabs } from 'antd';
import React, { useState } from 'react';
import TableQuery from './TableQuery';
import TableQueryList from './TableQueryList';
import TableColumn from './TableColumn';
import TableColumnList from './TableColumnList';

export interface TableShowDesignProps {
}

/**
 * @author xu.pengfei
 * @date 2025-12-18 20:44:13
 */
export default function TableShowDesign({ }: TableShowDesignProps) {
  return (
    <div className='fa-full-content fa-p12 fa-bg-grey fa-flex-row fa-gap12'>
      <FaFlexRestLayout className='fa-full-content fa-card'>
        <Divider>查询字段</Divider>
        <TableQueryList />

        <Divider>列表字段</Divider>
        <TableColumnList />
      </FaFlexRestLayout>

      <div style={{ width: 340 }} className='fa-card fa-p0 fa-tabs-block'>
        <Tabs
          items={[
            {
              key: 'query',
              label: '查询字段',
              children: <TableQuery />
            },
            {
              key: 'column',
              label: '列表字段',
              children: <TableColumn />
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
