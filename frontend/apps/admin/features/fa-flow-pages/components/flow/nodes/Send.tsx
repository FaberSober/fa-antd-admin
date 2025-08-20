import React from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import { FaIcon } from "@fa/icons";
import { Input } from "antd";
import { BaseDrawer } from '@fa/ui';
import { NodeCloseBtn } from '../cubes';
import AddNode from './AddNode';


export interface SendProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 22:11
 */
export default function Send({ node }: SendProps) {

  function delNode() {}

  return (
    <div className="node-wrap">
      <BaseDrawer
        triggerDom={(
          <div className="node-wrap-box start-node">
            <div className="title" style={{ background: '#576a95' }}>
              <FaIcon icon="fa-solid fa-user-large" />
              <span>{node.nodeName}</span>
              <NodeCloseBtn onClick={() => delNode()} />
            </div>
          </div>
        )}
        title={(
          <Input value={node.nodeName} variant="filled" />
        )}
      >
        drawer
      </BaseDrawer>

      <AddNode node={node} />
    </div>
  )
}
