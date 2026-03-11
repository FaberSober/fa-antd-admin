import { Flw } from "@/types";
import { useWorkFlowStore } from "../stores/useWorkFlowStore";
import { useCallback } from "react";

export default function useDelNode(node: Flw.Node, parentNode?: Flw.ParentNode) {
  const deleteNode = useWorkFlowStore(state => state.deleteNode);

  const delNode = useCallback(() => {
    if (parentNode) {
      deleteNode(node); // 使用 Store 方法删除
    } else {
      // 根节点处理（如果需要）
    }
  }, [node, parentNode, deleteNode]);

  return { delNode }
}
