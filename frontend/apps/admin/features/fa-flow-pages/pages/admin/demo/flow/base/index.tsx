import React, { useState } from 'react';
import { FaWorkFlow } from "@features/fa-flow-pages/components";
import { DEMO_FLOW_CONFIG } from './example';

/**
 * demo flow base editor
 * @author xu.pengfei
 * @date 2025/8/19 17:27
 */
export default function DemoFlowBase() {
  const [processModel, setProcessModel] = useState(DEMO_FLOW_CONFIG)

  return (
    <div>
      <div>demo flow base editor</div>

      <FaWorkFlow
        processModel={processModel}
        onChange={setProcessModel}
      />
    </div>
  )
}
