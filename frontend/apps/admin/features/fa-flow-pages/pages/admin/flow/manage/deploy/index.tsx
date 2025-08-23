import React, { useState } from 'react';
import { Allotment } from "allotment";
import { BaseTree } from "@fa/ui";
import { flowCatagoryApi } from "@features/fa-flow-pages/services";
import type { Admin } from "@features/fa-admin-pages/types";
import FlowCatagoryModal from "./modal/FlowCatagoryModal";
import FlowProcessList from './cube/FlowProcessList';


/**
 * @author xu.pengfei
 * @date 2025/8/22 16:43
 */
export default function FlowDeployPage() {
  const [viewRecord, setViewRecord] = useState<Admin.Department>();

  function onTreeSelect(keys: any[], event: any) {
    setViewRecord(keys.length > 0 ? event.node.sourceData : undefined);
  }

  function onAfterDelItem() {
    setViewRecord(undefined);
  }

  return (
    <div className="fa-full-content">
      <Allotment defaultSizes={[100, 500]}>
        {/* 左侧面板 */}
        <Allotment.Pane minSize={200} maxSize={400}>
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
        </Allotment.Pane>

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full">
          <FlowProcessList />
        </div>
      </Allotment>
    </div>
  )
}
