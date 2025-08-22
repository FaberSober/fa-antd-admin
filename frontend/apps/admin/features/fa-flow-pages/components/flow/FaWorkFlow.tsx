import React, { useState } from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import NodeWrap from './NodeWrap';
import './index.scss'
import FaWorkFlowContext, { FaWorkFlowContextProps } from './context/FaWorkFlowContext';
import { cloneDeep } from "lodash";
import { FaUtils } from "@fa/ui";


export interface FaWorkFlowProps {
  /** 流程配置JSON */
  processModel: Flow.ProcessModel;
  onChange?: (processModel: Flow.ProcessModel) => void;
}

/**
 * workflow editor
 * @author xu.pengfei
 * @date 2025/8/19 17:34
 */
export default function FaWorkFlow({ processModel, onChange }: FaWorkFlowProps) {
  const [zoom, setZoom] = useState<number>(1)

  function updateProcessModel(v: Flow.ProcessModel) {
    if (onChange) onChange(v)
  }

  function loopNode(n: Flow.Node, func: (n: Flow.Node) => void) {
    if (n.childNode) {
      loopNode(n.childNode, func)
    }
    func(n)
  }

  function deleteNode(node: Flow.Node) {
    // delete current node, move child node forward
    loopNode(processModel.nodeConfig, n => {
      if (n.childNode && n.childNode.nodeKey === node.nodeKey) {
        n.childNode = n.childNode.childNode
      }
    })
    updateProcessModel(cloneDeep(processModel))
  }

  const contextValue: FaWorkFlowContextProps = {
    processModel,
    updateProcessModel,
    refreshNode: () => {
      const processNew = cloneDeep(processModel)
      updateProcessModel(processNew)
      console.log('processNew', processNew)
    },
    deleteNode,
  }

  return (
    <FaWorkFlowContext.Provider value={contextValue}>
      <div
        id="fa-workflow-editor"
        className="fa-workflow-editor"
        onWheel={e => {
          FaUtils.preventEvent(e)
          const delta = e.deltaY > 0 ? -0.1 : 0.1;
          setZoom(prevZoom => Math.min(Math.max(prevZoom + delta, 0.1), 2));
        }}
      >
        <div className="fa-workflow-editor" style={{transformOrigin: '0 0', transform: `scale(${zoom})`}}>
          <div className="sc-workflow-design">
            <div className="box-scale">
              <NodeWrap node={processModel.nodeConfig}/>

              <div className="end-node">
                <div className="end-node-circle"></div>
                <div className="end-node-text">流程结束</div>
              </div>
            </div>
          </div>
        </div>

        <div className="fa-workflow-editor-tools">
          <p>缩放比例: {zoom.toFixed(2)}</p>
          <p>滚轮 ↑ 放大，滚轮 ↓ 缩小</p>
        </div>
      </div>
    </FaWorkFlowContext.Provider>
  )
}
