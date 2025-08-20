import React from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import { Button } from "antd";
import { CloseOutlined, LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import AddNode from './AddNode';
import { BaseDrawer } from "@fa/ui";


export interface BranchProps {
  /** 流程配置节点Node JSON */
  node: Flow.Node;
}

/**
 * @author xu.pengfei
 * @date 2025/8/19 22:19
 */
export default function Branch({node}: BranchProps) {

  function addTerm() {
  }

  function arrTransfer(index: number, type: number = 1) {
  }

  function delTerm(index: number) {
  }

  function toText(nodeConfig: Flow.Node, index: number) {
    const {conditionList} = nodeConfig.conditionNodes![index]
    if (conditionList && conditionList.length == 1) {
      const text = conditionList.map((conditionGroup) => conditionGroup.map((item) => `${item.label}${item.operator}${item.value}`)).join(' 和 ')
      return text
    } else if (conditionList && conditionList.length > 1) {
      return conditionList.length + '个条件，或满足'
    } else {
      if (index == nodeConfig.conditionNodes!.length - 1) {
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
                    <BaseDrawer
                      triggerDom={(
                        <div className="auto-judge">
                          {/* move this condition to left */}
                          {index !== 0 && (
                            <div className="sort-left" onClick={() => arrTransfer(index, -1)}>
                              <LeftOutlined/>
                            </div>
                          )}

                          <div className="title">
                            <span className="node-title">{cNode.nodeName}</span>
                            <span className="priority-title">优先级{cNode.priorityLevel}</span>
                            <div className="close fa-link-btn" onClick={() => delTerm(index)}>
                              <CloseOutlined/>
                            </div>
                          </div>

                          <div className="content">
                            {conditionText ? <span>{conditionText}</span> : <span className="placeholder">请设置条件</span>}
                          </div>

                          {/* move this condition to right */}
                          {index !== node.conditionNodes!.length - 1 && (
                            <div className="sort-right" onClick={() => arrTransfer(index)}>
                              <RightOutlined/>
                            </div>
                          )}
                        </div>
                      )}
                    >
                      {index}
                    </BaseDrawer>

                    {cNode.childNode && <AddNode node={cNode.childNode}/>}
                  </div>
                </div>

                {index === 0 && <div className="top-left-cover-line"/>}
                {index === 0 && <div className="bottom-left-cover-line"/>}

                {index === node.conditionNodes!.length - 1 && <div className="top-right-cover-line"/>}
                {index === node.conditionNodes!.length - 1 && <div className="bottom-right-cover-line"/>}
              </div>
            )
          })}

        </div>
      </div>
    </div>
  )
}
