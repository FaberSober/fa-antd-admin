import React from 'react';
import { Flow, FlowEnums } from "@features/fa-flow-pages/types";
import { Approver, Branch, Promoter, Send } from "./nodes";


export interface NodeWrapProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 20:12
 */
export default function NodeWrap({ node }: NodeWrapProps) {
  return (
    <div>
      {node.type === FlowEnums.NodeType.major && <Promoter node={node} />}
      {node.type === FlowEnums.NodeType.approval && <Approver node={node} />}
      {node.type === FlowEnums.NodeType.cc && <Send node={node} />}
      {node.type === FlowEnums.NodeType.conditionBranch && <Branch node={node} />}

      {node.childNode && <NodeWrap node={node.childNode} />}
    </div>
  )
}
