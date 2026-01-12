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
