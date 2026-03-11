import { Flow, Flw } from "@/types";
import { FaUtils } from "@fa/ui";

export function getNodeKey() {
  return 'flk_' + Date.now() + "_" + FaUtils.generateId();
}

export function getProcessModel(flowProcess: Flow.FlowProcess|Flow.FlwProcess): Flw.ProcessModel {
  const processModel:Flw.ProcessModel = JSON.parse(flowProcess.modelContent);
  return processModel;
}

/**
 * 根据节点key获取节点配置
 * @param processModel
 * @param nodeKey
 * @returns
 */
export function getNodeConfigByKey(processModel:Flw.ProcessModel, nodeKey: string): Flw.Node | undefined {
  if (!processModel || !processModel.nodeConfig) {
    return undefined;
  }
  let targetNode: Flw.Node | undefined = undefined;
  function loopNode(node: Flw.Node) {
    if (node.nodeKey === nodeKey) {
      targetNode = node;
      return;
    }
    if (node.childNode) {
      loopNode(node.childNode);
    }
  }
  loopNode(processModel.nodeConfig);
  return targetNode;
}


/** 递归遍历节点 */
export function loopNode(n: Flw.Node, func: (n: Flw.Node) => void) {
  if (n.childNode) {
    loopNode(n.childNode, func)
  }
  func(n)
}

// 新增：递归查找节点（基于 nodeKey，支持分支）
export function findNodeByKey(draftNode: Flw.Node, key: string): Flw.Node | undefined {
  if (draftNode.nodeKey === key) return draftNode;
  if (draftNode.childNode) {
    const found = findNodeByKey(draftNode.childNode, key);
    if (found) return found;
  }
  // 处理条件分支
  if (draftNode.conditionNodes) {
    for (const cn of draftNode.conditionNodes) {
      if (cn.nodeKey === key) return cn as unknown as Flw.Node; // ConditionNode 兼容 Node
      if (cn.childNode) {
        const found = findNodeByKey(cn.childNode, key);
        if (found) return found;
      }
    }
  }
  // 处理并行分支（类似其他分支）
  if (draftNode.parallelNodes) {
    for (const pn of draftNode.parallelNodes) {
      if (pn.nodeKey === key) return pn;
      if (pn.childNode) {
        const found = findNodeByKey(pn.childNode, key);
        if (found) return found;
      }
    }
  }
  // 处理包容分支和路由分支（类似）
  if (draftNode.inclusiveNodes) {
    for (const inNode of draftNode.inclusiveNodes) {
      if (inNode.nodeKey === key) return inNode as unknown as Flw.Node;
      if (inNode.childNode) {
        const found = findNodeByKey(inNode.childNode, key);
        if (found) return found;
      }
    }
  }
  if (draftNode.routeNodes) {
    for (const rn of draftNode.routeNodes) {
      if (rn.nodeKey === key) return rn as unknown as Flw.Node;
      if (rn.childNode) {
        const found = findNodeByKey(rn.childNode, key);
        if (found) return found;
      }
    }
  }
  return undefined;
}
