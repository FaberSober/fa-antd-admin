import { Flw, FlwEnums } from "@features/fa-flow-pages/types";
import { isNil } from "lodash";
import { useNodeCls } from './hooks';
import { Approver, Branch, Parallel, Inclusive, Promoter, Send, AutoPass, AutoReject, End } from "./nodes";
import clsx from 'clsx';


export interface NodeWrapProps {
  /** 流程配置节点Node JSON */
  node?: Flw.Node;
  parentNode?: Flw.ParentNode;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 20:12
 */
export default function NodeWrap({ node, parentNode }: NodeWrapProps) {

  // 判断节点类型,运行中不同类型的task节点状态,展示不同的颜色
  const cls = useNodeCls(node)

  if (isNil(node)) return null;
  return (
    <div className={clsx('fa-workflow-node', cls)}>
      {node.type === FlwEnums.NodeType.major && <Promoter node={node} />}
      {node.type === FlwEnums.NodeType.approval && <Approver node={node} parentNode={parentNode!} />}
      {node.type === FlwEnums.NodeType.cc && <Send node={node} parentNode={parentNode!} />}
      {node.type === FlwEnums.NodeType.conditionBranch && <Branch node={node} parentNode={parentNode!} />}
      {node.type === FlwEnums.NodeType.parallelBranch && <Parallel node={node} parentNode={parentNode!} />}
      {node.type === FlwEnums.NodeType.inclusiveBranch && <Inclusive node={node} parentNode={parentNode!} />}
      {node.type === FlwEnums.NodeType.autoPass && <AutoPass node={node} parentNode={parentNode!} />}
      {node.type === FlwEnums.NodeType.autoReject && <AutoReject node={node} parentNode={parentNode!} />}
      {node.type === FlwEnums.NodeType.end && <End node={node} parentNode={parentNode!} />}

      {node.childNode && <NodeWrap node={node.childNode} parentNode={node} />}
    </div>
  )
}
