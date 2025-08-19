import React, { useState } from 'react';
import { FaWorkFlow } from "@features/fa-flow-pages/components";
import { DEMO_FLOW_CONFIG } from "@features/fa-flow-pages/pages/admin/demo/flow/base/example";

/**
 * demo flow base editor
 * @author xu.pengfei
 * @date 2025/8/19 17:27
 */
export default function DemoFlowBase() {
  const [data, setData] = useState(DEMO_FLOW_CONFIG)

  return (
    <div>
      <div>demo flow base editor</div>

      <FaWorkFlow config={data.nodeConfig} />
    </div>
  )
}
