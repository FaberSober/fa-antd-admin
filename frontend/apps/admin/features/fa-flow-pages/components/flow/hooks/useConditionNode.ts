import { Flow } from "@features/fa-flow-pages/types";
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";

/**
 * @author xu.pengfei
 * @date 2025/8/20 14:08
 */
export default function useNode(node: Flow.ConditionNode, onNodeChange?: (n: Flow.ConditionNode) => void) {
  const [nodeCopy, setNodeCopy] = useState(cloneDeep(node))

  useEffect(() => {
    setNodeCopy(cloneDeep(node))
    if (onNodeChange) {
      onNodeChange(node)
    }
  }, [node])

  function updateNodeProps(propKey: keyof Flow.ConditionNode, value: any) {
    setNodeCopy(prev => ({ ...prev, [propKey]: value }))
  }

  return { nodeCopy, setNodeCopy, updateNodeProps }
}
