import React, { useEffect, useMemo, useState } from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import { FaIcon } from '@fa/icons';
import { BaseDrawer } from "@fa/ui";
import AddNode from './AddNode';
import { Input } from "antd";
import { useNode } from '../hooks';


export interface PromoterProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 20:22
 */
export default function Promoter({node}: PromoterProps) {
  const {nodeCopy, setNodeCopy, updateNodeProps} = useNode(node)

  function toText() {
    if (nodeCopy.nodeAssigneeList && nodeCopy.nodeAssigneeList.length > 0) {
      return nodeCopy.nodeAssigneeList.map(item => item.name).join("、")
    } else {
      return "所有人"
    }
  }

  const text = useMemo(() => toText(), [nodeCopy])

  return (
    <div className="node-wrap">
      <BaseDrawer
        triggerDom={(
          <div className="node-wrap-box start-node">
            <div className="title" style={{background: '#576a95'}}>
              <FaIcon icon="fa-solid fa-user-large"/>
              <span>{nodeCopy.nodeName}</span>
            </div>
            <div className="content">
              <span>{text}</span>
            </div>
          </div>
        )}
        title={(
          <Input value={nodeCopy.nodeName} variant="filled" onChange={e => updateNodeProps('nodeName', e.target.value)}/>
        )}
      >
        drawer1
      </BaseDrawer>

      <AddNode node={node}/>
    </div>
  )
}
