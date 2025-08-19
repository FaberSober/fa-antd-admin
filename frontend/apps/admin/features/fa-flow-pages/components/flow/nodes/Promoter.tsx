import React from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import { FaIcon } from '@fa/icons';
import { BaseDrawer } from "@fa/ui";
import AddNode from './AddNode';
import { Input } from "antd";


export interface PromoterProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 20:22
 */
export default function Promoter({ node }: PromoterProps) {

  function show() {

  }


  function toText(nodeConfig: Flow.Node){
    if(nodeConfig.nodeAssigneeList && nodeConfig.nodeAssigneeList.length > 0){
      return nodeConfig.nodeAssigneeList.map(item=>item.name).join("、")
    }else{
      return "所有人"
    }
  }

  return (
    <div className="node-wrap">
      <BaseDrawer
        triggerDom={(
          <div className="node-wrap-box start-node" onClick={show}>
            <div className="title" style={{ background: '#576a95' }}>
              <FaIcon icon="fa-solid fa-user-large" />
              <span>{node.nodeName}</span>
            </div>
            <div className="content">
              <span>{toText(node)}</span>
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
