import React from 'react'
import { Tabs } from 'antd'
import DemoInfinitScrollList from './cube/DemoInfinitScrollList'
import DemoApiScrollList from './cube/DemoApiScrollList'
import DemoApiScrollListSimple from './cube/DemoApiScrollListSimple'


export default function DemoListShowPage() {

  return (
    <div className='fa-full-content-p12 fa-tabs'>
      <Tabs
        defaultActiveKey="1"
        items={[
          { label: '加载更多', key: '1', children: <DemoInfinitScrollList />  },
          { label: 'API加载更多', key: '2', children: <DemoApiScrollList />  },
          { label: 'API加载更多(简化版)', key: '3', children: <DemoApiScrollListSimple />  },
        ]}
        type='card'
      />
    </div>
  )
}
