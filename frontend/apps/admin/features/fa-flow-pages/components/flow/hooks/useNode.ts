import { Flow } from "@features/fa-flow-pages/types";
import { useEffect, useState } from "react";
import { cloneDeep, set } from "lodash";

/**
 * @author xu.pengfei
 * @date 2025/8/20 14:08
 */
export default function useNode(node: Flow.Node, onNodeChange?: (n: Flow.Node) => void) {
  const [nodeCopy, setNodeCopy] = useState(cloneDeep(node))

  useEffect(() => {
    setNodeCopy(cloneDeep(node))
    if (onNodeChange) {
      onNodeChange(node)
    }
  }, [node])

  function updateNodeProps(path: keyof Flow.Node | any, value: any) {
    setNodeCopy(prev => {
      set(prev, path, value)
      return cloneDeep(prev)
    })
  }

  return { nodeCopy, setNodeCopy, updateNodeProps }
}
