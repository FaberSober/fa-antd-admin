import React, { useState, useEffect } from 'react';
import { Allotment } from "allotment";
import { List, Spin } from 'antd';
import { flowCatagoryApi, flowProcessApi } from '@/services';
import { Flow, Fa } from '@/types';
import { BaseTree } from '@fa/ui';


export default function FlowAuditStart() {
  const [cata, setCata] = useState<Flow.FlowCatagory>();
  const [flows, setFlows] = useState<Flow.FlowProcess[]>([]);

  function onTreeSelect(keys: any[], event: any) {
    setCata(keys.length > 0 ? event.node.sourceData : undefined);
  }

  useEffect(() => {
    getFlows();
  }, [cata]);

  function getFlows() {
    flowProcessApi.list({
      query: { catagoryId: cata?.id },
      sorter: 'sort ASC',
    }).then(res => {
      setFlows(res.data);
    })
  }

  return (
    <div className='fa-full-content'>
      <Allotment defaultSizes={[100, 500]}>
        {/* 左侧面板 */}
        <Allotment.Pane minSize={200} maxSize={400}>
          <BaseTree
            // showRoot
            rootName="全部"
            onSelect={onTreeSelect}
            // 自定义配置
            serviceName="分类"
            serviceApi={flowCatagoryApi}
            defaultExpandAll
            showTopAddBtn={false}
            bodyStyle={{paddingRight: 12}}
          />
        </Allotment.Pane>

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full" style={{marginLeft: 12}}>
          <div className='fa-flex-row fa-flex-wrap'>
            {flows.map(f => {
              return (
                <div key={f.id} className='fa-btn'>
                  {f.processName}
                </div>
              )
            })}
          </div>
        </div>
      </Allotment>
    </div>
  )
}
