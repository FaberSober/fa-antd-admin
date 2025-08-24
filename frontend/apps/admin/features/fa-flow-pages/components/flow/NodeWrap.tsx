import React, { useContext, useMemo } from 'react';
import { Flw, FlwEnums } from "@features/fa-flow-pages/types";
import { Approver, Branch, Promoter, Send } from "./nodes";
import { isNil } from "lodash";
import FaWorkFlowContext from './context/FaWorkFlowContext';


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
  const { renderNodes } = useContext(FaWorkFlowContext)

  // 判断节点类型,运行中不同类型的task节点状态,展示不同的颜色
  const cls = useMemo(() => {
    if (isNil(node) || isNil(renderNodes)) return "fa-workflow-node-idle";
    if (node.type === FlwEnums.NodeType.conditionBranch) return "";
    if (renderNodes[node.nodeKey || ''] === '0') {
      return 'fa-workflow-node-done'
    } else if (renderNodes[node.nodeKey || ''] === '1') {
      return 'fa-workflow-node-active'
    }
    return "fa-workflow-node-idle";
  }, [node])


  if (isNil(node)) return null;
  return (
    <div className={cls}>
      {node.type === FlwEnums.NodeType.major && <Promoter node={node} />}
      {node.type === FlwEnums.NodeType.approval && <Approver node={node} parentNode={parentNode} />}
      {node.type === FlwEnums.NodeType.cc && <Send node={node} parentNode={parentNode} />}
      {node.type === FlwEnums.NodeType.conditionBranch && <Branch node={node} parentNode={parentNode!} />}

      {node.childNode && <NodeWrap node={node.childNode} parentNode={node} />}
    </div>
  )
}
