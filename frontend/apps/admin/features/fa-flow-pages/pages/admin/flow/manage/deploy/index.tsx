import { BaseTree } from "@fa/ui";
import { flowCatagoryApi } from "@features/fa-flow-pages/services";
import { Flow } from '@features/fa-flow-pages/types';
import { Splitter } from 'antd';
import { useState } from 'react';
import FlowProcessList from './cube/FlowProcessList';
import FlowCatagoryModal from "./modal/FlowCatagoryModal";


/**
 * @author xu.pengfei
 * @date 2025/8/22 16:43
 */
export default function FlowDeployPage() {
  const [viewRecord, setViewRecord] = useState<Flow.FlowCatagory>();

  function onTreeSelect(keys: any[], event: any) {
    setViewRecord(keys.length > 0 ? event.node.sourceData : undefined);
  }

  function onAfterDelItem() {
    setViewRecord(undefined);
  }

  return (
    <div className="fa-full-content">
      <Splitter>
        {/* 左侧面板 */}
        <Splitter.Panel defaultSize={300} min={240} max="50%" collapsible>
          <BaseTree
            // showRoot
            rootName="全部"
            showOprBtn
            onSelect={onTreeSelect}
            onAfterDelItem={onAfterDelItem}
            // 自定义配置
            serviceName="分类"
            ServiceModal={FlowCatagoryModal}
            serviceApi={flowCatagoryApi}
          />
        </Splitter.Panel>

        {/* 右侧面板 */}
        <Splitter.Panel>
          <div className="fa-flex-column fa-full fa-relative">
            <FlowProcessList catagoryId={viewRecord?.id} />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  )
}
