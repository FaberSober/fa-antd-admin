import React from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import { cloneDeep } from "lodash";
import FaWorkFlowContext, { FaWorkFlowContextProps } from './context/FaWorkFlowContext';
import NodeWrap from './NodeWrap';
import './index.scss'
import ZoomPanEditor from "@features/fa-flow-pages/components/flow/cubes/ZoomPanEditor";


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
export default function FaWorkFlow({processModel, onChange}: FaWorkFlowProps) {
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
      <ZoomPanEditor>
        <div className="sc-workflow-design">
          <div className="box-scale">
            <NodeWrap node={processModel.nodeConfig}/>

            <div className="end-node">
              <div className="end-node-circle"></div>
              <div className="end-node-text">流程结束</div>
            </div>
          </div>
        </div>
      </ZoomPanEditor>
    </FaWorkFlowContext.Provider>
  )
}
