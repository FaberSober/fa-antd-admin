import React, { useContext } from 'react';
import { Flw } from "@features/fa-flow-pages/types";
import { Button } from "antd";
import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import AddNode from './AddNode';
import '../styles/Branch.scss'
import NodeWrap from "@features/fa-flow-pages/components/flow/NodeWrap";
import BranchNode from "@features/fa-flow-pages/components/flow/nodes/BranchNode";
import { useNode } from "@features/fa-flow-pages/components/flow/hooks";
import FaWorkFlowContext from "@features/fa-flow-pages/components/flow/context/FaWorkFlowContext";
import { FaArrUtils } from '@fa/ui';
import { getNodeKey } from "@features/fa-flow-pages/components/flow/utils";


export interface BranchProps {
  /** 流程配置节点Node JSON */
  node: Flw.Node;
  parentNode: Flw.Node | Flw.ConditionNode;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 22:19
 */
export default function Branch({node, parentNode}: BranchProps) {
  const {refreshNode} = useContext(FaWorkFlowContext)
  const {nodeCopy, setNodeCopy, updateNodeProps} = useNode(node)

  function addTerm() {
    let len = nodeCopy.conditionNodes!.length + 1
    nodeCopy.conditionNodes!.push({
      nodeName: '条件' + len,
      nodeKey: getNodeKey(),
      type: 3,
      priorityLevel: len,
      conditionList: []
    })
    const nodeNew = { ...nodeCopy }
    Object.assign(node, nodeNew); // Object.assign(a, b); 会把 b 的属性复制到 a 上，不会改变 a 的引用。
    refreshNode();
  }

  function delTerm(index: number) {
    nodeCopy.conditionNodes!.splice(index, 1)
    if (nodeCopy.conditionNodes!.length == 1) { // 只剩下一个条件节点，则将剩下的条件节点的条件下属子节点，移动到当前节点的子节点
      if (nodeCopy.childNode) {
        if (nodeCopy.conditionNodes![0].childNode) { // 剩下的最后一个条件节点，如果有条件下属子节点，则将该子节点设置为父节点的子节点
          parentNode.childNode = nodeCopy.conditionNodes![0].childNode
        } else { // 剩下的最后一个条件节点，如果没有条件下属子节点，则将整个条件节点的子节点，设置为父节点的子节点
          parentNode.childNode = nodeCopy.childNode;
        }
      }
    }
    const nodeNew = { ...nodeCopy }
    Object.assign(node, nodeNew); // Object.assign(a, b); 会把 b 的属性复制到 a 上，不会改变 a 的引用。
    refreshNode();
  }

  /**
   * move condition position
   * @param index
   * @param type -1-move left, 1-move right
   */
  function arrTransfer(index: number, type: number = 1) {
    const conditionNodes = FaArrUtils.arrTransfer(nodeCopy.conditionNodes!, index, index + type)
    const nodeNew = {
      ...nodeCopy,
      conditionNodes,
    }
    setNodeCopy(nodeNew)
    Object.assign(node, nodeNew); // Object.assign(a, b); 会把 b 的属性复制到 a 上，不会改变 a 的引用。
    refreshNode();
  }

  function toText(nodeConfig: Flw.Node, index: number) {
    const {conditionList} = nodeConfig.conditionNodes![index]
    if (conditionList && conditionList.length === 1) {
      const text = conditionList.map((conditionGroup) => conditionGroup.map((item) => `${item.label}${item.operator}${item.value}`)).join(' 和 ')
      return text
    } else if (conditionList && conditionList.length > 1) {
      return conditionList.length + '个条件，或满足'
    } else {
      if (index === nodeConfig.conditionNodes!.length - 1) {
        return '其他条件进入此流程'
      } else {
        return false
      }
    }
  }

  return (
    <div className="branch-wrap">
      <div className="branch-box-wrap">
        <div className="branch-box">
          <Button onClick={addTerm} shape="round" icon={<PlusOutlined/>} className="add-branch">添加条件</Button>

          {/* loop condition */}
          {node.conditionNodes && node.conditionNodes.map((cNode, index) => {
            const conditionText = toText(node, index);
            return (
              <div className="col-box" key={cNode.nodeKey}>
                <div className="condition-node">
                  <div className="condition-node-box">
                    <div className="auto-judge">
                      {/* move this condition to left */}
                      {index !== 0 && (
                        <div className="sort-left" onClick={() => arrTransfer(index, -1)}>
                          <LeftOutlined/>
                        </div>
                      )}

                      <BranchNode
                        node={cNode}
                        onDel={() => delTerm(index)}
                        conditionText={conditionText}
                        index={index}
                        onSubmit={cn => {
                          const nodeNew = {
                            ...nodeCopy,
                            conditionNodes: nodeCopy.conditionNodes!.map((oi) => oi.nodeKey === cn.nodeKey ? cn : oi),
                          }
                          Object.assign(node, nodeNew); // Object.assign(a, b); 会把 b 的属性复制到 a 上，不会改变 a 的引用。
                          refreshNode();
                        }}
                      />

                      {/* move this condition to right */}
                      {index !== node.conditionNodes!.length - 1 && (
                        <div className="sort-right" onClick={() => arrTransfer(index)}>
                          <RightOutlined/>
                        </div>
                      )}
                    </div>

                    <AddNode parentNode={cNode}/>
                  </div>
                </div>

                {/* condition node's child node */}
                <NodeWrap node={cNode.childNode} parentNode={cNode}/>

                {index === 0 && <div className="top-left-cover-line"/>}
                {index === 0 && <div className="bottom-left-cover-line"/>}

                {index === node.conditionNodes!.length - 1 && <div className="top-right-cover-line"/>}
                {index === node.conditionNodes!.length - 1 && <div className="bottom-right-cover-line"/>}
              </div>
            )
          })}

        </div>

        <AddNode parentNode={node}/>
      </div>
    </div>
  )
}
