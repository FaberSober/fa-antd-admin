import { Flw, FlwEnums } from "@features/fa-flow-pages/types";
import { isNil } from "lodash";
import { useMemo } from "react";
import { useWorkFlowStore } from "../stores/useWorkFlowStore";


const noClassNode = [FlwEnums.NodeType.conditionBranch, FlwEnums.NodeType.parallelBranch]

/**
 * 判断节点类型,运行中不同类型的task节点状态,展示不同的颜色
 * @author xu.pengfei
 * @date 2026/01/19 14:38
 */
export default function useNodeCls(node: Flw.Node|undefined) {
  const renderNodes = useWorkFlowStore(state => state.renderNodes);

  const cls = useMemo(() => {
    if (isNil(node) || isNil(renderNodes)) return "fa-workflow-node-idle";

    if (noClassNode.indexOf(node.type) > -1) return "";

    if (renderNodes[node.nodeKey || ''] === '0') {
      return 'fa-workflow-node-done'
    } else if (renderNodes[node.nodeKey || ''] === '1') {
      return 'fa-workflow-node-active'
    }
    return "fa-workflow-node-idle";
  }, [node, renderNodes])

  return cls
}
