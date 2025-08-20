import React from 'react';
import { Flow } from "@features/fa-flow-pages/types";
import NodeWrap from './NodeWrap';
import './index.scss'
import FaWorkFlowContext, { FaWorkFlowContextProps } from './context/FaWorkFlowContext';
import { cloneDeep } from "lodash";


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

  function updateProcessModel(v: Flow.ProcessModel) {
    if (onChange) onChange(v)
  }

  const contextValue: FaWorkFlowContextProps = {
    processModel,
    updateProcessModel,
    refreshNode: () => {
      const processNew = cloneDeep(processModel)
      updateProcessModel(processNew)
      console.log('processNew', processNew)
    }
  }

  return (
    <FaWorkFlowContext.Provider value={contextValue}>
      <div className="sc-workflow-design">
        <div className="box-scale">
          <NodeWrap node={processModel.nodeConfig}/>

          <div className="end-node">
            <div className="end-node-circle"></div>
            <div className="end-node-text">流程结束</div>
          </div>
        </div>
      </div>
    </FaWorkFlowContext.Provider>
  )
}
