import React from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import './index.scss'
import NodeWrap from "@features/fa-flow-pages/components/flow/NodeWrap";


export interface FaWorkFlowProps {
  /** 流程配置JSON */
  config: Flow.Node;
}

/**
 * workflow editor
 * @author xu.pengfei
 * @date 2025/8/19 17:34
 */
export default function FaWorkFlow({ config }: FaWorkFlowProps) {

  return (
    <div className="sc-workflow-design">
      <div className="box-scale">
        {/*<node-wrap*/}
        {/*  v-if="nodeConfig"*/}
        {/*  v-model="nodeConfig"></node-wrap>*/}

        <NodeWrap node={config} />

        <div className="end-node">
          <div className="end-node-circle"></div>
          <div className="end-node-text">流程结束</div>
        </div>
      </div>
      {/*<use-select*/}
      {/*  v-if="selectVisible"*/}
      {/*  ref="useselect"*/}
      {/*@closed="selectVisible = false"></use-select>*/}
    </div>
  )
}
