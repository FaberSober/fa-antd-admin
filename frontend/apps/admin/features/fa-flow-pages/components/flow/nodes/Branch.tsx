import React, { useContext } from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import { Button } from "antd";
import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import AddNode from './AddNode';
import '../styles/Branch.scss'
import NodeWrap from "@features/fa-flow-pages/components/flow/NodeWrap";
import BranchNode from "@features/fa-flow-pages/components/flow/nodes/BranchNode";
import { useNode } from "@features/fa-flow-pages/components/flow/hooks";
import FaWorkFlowContext from "@features/fa-flow-pages/components/flow/context/FaWorkFlowContext";
import { FaArrUtils } from '@fa/ui';


export interface BranchProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
  parentNode?: Flow.Node | Flow.ConditionNode;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 22:19
 */
export default function Branch({node, parentNode}: BranchProps) {
  const {refreshNode} = useContext(FaWorkFlowContext)
  const {nodeCopy, setNodeCopy, updateNodeProps} = useNode(node)

  function addTerm() {
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

  function delTerm(index: number) {
  }

  function toText(nodeConfig: Flow.Node, index: number) {
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
          {nodeCopy.conditionNodes && nodeCopy.conditionNodes.map((cNode, index) => {
            const conditionText = toText(nodeCopy, index);
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
                      {index !== nodeCopy.conditionNodes!.length - 1 && (
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

                {index === nodeCopy.conditionNodes!.length - 1 && <div className="top-right-cover-line"/>}
                {index === nodeCopy.conditionNodes!.length - 1 && <div className="bottom-right-cover-line"/>}
              </div>
            )
          })}

        </div>

        <AddNode parentNode={nodeCopy.childNode}/>
      </div>
    </div>
  )
}
