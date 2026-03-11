import { useMemo } from "react";
import { useWorkFlowStore } from "../stores/useWorkFlowStore";
import { Flw, FlwEnums } from "@features/fa-flow-pages/types";

export default function useNodeTreeData() {
  const processModel = useWorkFlowStore(state => state.processModel);

  const treeData = useMemo(() => {
    // 解析 processModel，生成适用于 TreeSelect 的数据结构
    // 流程是线性的，childNode 作为同一级节点，分支节点作为二级 children
    if (!processModel?.nodeConfig) {
      return [];
    }

    // 递归遍历线性链，返回平面数组
    function buildTree(node: Flw.Node): any[] {
      const result: any[] = [];

      // 构建当前节点的分支 children（分支本身不可选，只显示分支下的子节点）
      const branchChildren: any[] = [];

      if (node.conditionNodes && node.conditionNodes.length > 0) {
        node.conditionNodes.forEach((cn) => {
          // 分支节点本身不可选，获取分支的子节点
          if (cn.childNode) {
            const branchChildNodes = buildTree(cn.childNode);
            branchChildren.push(...branchChildNodes);
          }
        });
      }

      if (node.parallelNodes && node.parallelNodes.length > 0) {
        node.parallelNodes.forEach((pn) => {
          // 分支节点本身不可选，获取分支的子节点
          if (pn.childNode) {
            const branchChildNodes = buildTree(pn.childNode);
            branchChildren.push(...branchChildNodes);
          }
        });
      }

      if (node.inclusiveNodes && node.inclusiveNodes.length > 0) {
        node.inclusiveNodes.forEach((in_) => {
          // 分支节点本身不可选，获取分支的子节点
          if (in_.childNode) {
            const branchChildNodes = buildTree(in_.childNode);
            branchChildren.push(...branchChildNodes);
          }
        });
      }

      // 构建当前节点
      result.push({
        title: node.nodeName,
        value: node.nodeKey,
        key: node.nodeKey,
        children: branchChildren.length > 0 ? branchChildren : undefined,
        disabled: node.type === FlwEnums.NodeType.conditionBranch ||
                  node.type === FlwEnums.NodeType.parallelBranch ||
                  node.type === FlwEnums.NodeType.inclusiveBranch ||
                  node.type === FlwEnums.NodeType.routeBranch,
      });

      // 递归处理 childNode（同一级，不作为 children）
      if (node.childNode) {
        result.push(...buildTree(node.childNode));
      }

      return result;
    }

    return buildTree(processModel.nodeConfig);
  }, [processModel]);

  return { treeData };
}
