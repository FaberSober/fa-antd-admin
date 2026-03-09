import { BaseTree } from "@fa/ui";
import { flowCatagoryApi } from "@features/fa-flow-pages/services";
import { Flow } from "@features/fa-flow-pages/types";
import { Splitter } from "antd";
import { useState } from "react";
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
    <div className="fa-full-content-p12">
      <Splitter>
        {/* 左侧面板 */}
        <Splitter.Panel defaultSize={300} min={240} max="50%" collapsible>
          <BaseTree
            // showRoot
            rootName="全部"
            onSelect={onTreeSelect}
            // 自定义配置
            serviceName="分类"
            serviceApi={flowCatagoryApi}
            showTopAddBtn={false}
          />
        </Splitter.Panel>

        {/* 右侧面板 */}
        <Splitter.Panel>
          <div className="fa-flex-column fa-full fa-relative">
            <FlwHisInstanceList />
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}
