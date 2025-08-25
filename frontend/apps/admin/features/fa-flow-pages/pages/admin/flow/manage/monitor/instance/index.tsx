import React, { useState } from "react";
import { Allotment } from "allotment";
import { BaseTree } from "@fa/ui";
import { flowCatagoryApi } from "@features/fa-flow-pages/services";
import { Flow } from "@features/fa-flow-pages/types";
import FlwInstanceList from "./cube/FlwInstanceList";
import FlwHisInstanceList from "./cube/FlwHisInstanceList";

/**
 * @author xu.pengfei
 * @date 2025/8/22 16:43
 */
export default function FlowMonitorInstancePage() {
  const [viewRecord, setViewRecord] = useState<Flow.FlowCatagory>();

  function onTreeSelect(keys: any[], event: any) {
    setViewRecord(keys.length > 0 ? event.node.sourceData : undefined);
  }

  return (
    <div className="fa-full-content">
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
            showTopAddBtn={false}
          />
        </Allotment.Pane>

        {/* 右侧面板 */}
        <div className="fa-flex-column fa-full">
          <FlwHisInstanceList />
        </div>
      </Allotment>
    </div>
  );
}
