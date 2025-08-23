import React from 'react';
import { Flw, FlwEnums } from "@features/fa-flow-pages/types";
import { Approver, Branch, Promoter, Send } from "./nodes";
import { isNil } from "lodash";


export interface NodeWrapProps {
  /** 流程配置节点Node JSON */
  node?: Flw.Node;
  parentNode?: Flw.Node | Flw.ConditionNode;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 20:12
 */
export default function NodeWrap({ node, parentNode }: NodeWrapProps) {
  if (isNil(node)) return null;
  return (
    <div>
      {node.type === FlwEnums.NodeType.major && <Promoter node={node} />}
      {node.type === FlwEnums.NodeType.approval && <Approver node={node} parentNode={parentNode} />}
      {node.type === FlwEnums.NodeType.cc && <Send node={node} parentNode={parentNode} />}
      {node.type === FlwEnums.NodeType.conditionBranch && <Branch node={node} parentNode={parentNode} />}

      {node.childNode && <NodeWrap node={node.childNode} parentNode={node} />}
    </div>
  )
}
