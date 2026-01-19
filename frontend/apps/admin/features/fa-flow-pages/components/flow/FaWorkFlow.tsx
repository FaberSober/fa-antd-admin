import ZoomPanEditor from "@features/fa-flow-pages/components/flow/cubes/ZoomPanEditor";
import { Flow, Flw } from "@features/fa-flow-pages/types";
import { Button, Space, Tag } from 'antd';
import clsx from 'clsx';
import { useEffect } from 'react';
import './index.scss';
import NodeWrap from './NodeWrap';
import { useWorkFlowStore } from './stores/useWorkFlowStore';
import { BaseDrawer } from "@fa/ui";
import JsonView from '@uiw/react-json-view';
import { lightTheme } from '@uiw/react-json-view/light';


export interface FaWorkFlowProps {
  /** 流程配置 */
  flowProcess: Flow.FlowProcess;
  /** 流程配置JSON */
  processModel: Flw.ProcessModel;
  onChange?: (processModel: Flw.ProcessModel) => void;
  /** 流程task节点状态(适用于进行中的流程展示流程节点运行状态) */
  renderNodes?: Record<string, '0' | '1'>;
  /** 是否显示流程图图例 */
  showLegends?: boolean;
  /** 是否只读 */
  readOnly?: boolean;
}

/**
 * workflow editor
 * @author xu.pengfei
 * @date 2025/8/19 17:34
 */
export default function FaWorkFlow({ flowProcess, processModel, onChange, renderNodes, showLegends, readOnly = false }: FaWorkFlowProps) {
  // 从 Store 中获取设置方法和流程数据
  const setFlowProcess = useWorkFlowStore(state => state.setFlowProcess);
  const setProcessModel = useWorkFlowStore(state => state.setProcessModel);
  const setExternalOnChange = useWorkFlowStore(state => state.setExternalOnChange);
  const setRenderNodes = useWorkFlowStore(state => state.setRenderNodes);
  const setReadOnly = useWorkFlowStore(state => state.setReadOnly);
  const clear = useWorkFlowStore(state => state.clear);

  // 清理 Store 数据，防止数据残留
  useEffect(() => {
    return () => {
      console.log('FaWorkFlow unmount, clearing store data');
      clear();
    }
  }, [clear]);

  useEffect(() => {
    setFlowProcess(flowProcess);
  }, [flowProcess]);

  // 1. 同步外部传入的 processModel 到 Store (仅在 processModel 变化时执行)
  useEffect(() => {
    setProcessModel(processModel);
  }, [processModel]);

  useEffect(() => {
    setRenderNodes(renderNodes||{})
  }, [renderNodes]);

  useEffect(() => {
    setReadOnly(readOnly);
  }, [readOnly]);

  // 2. 同步外部传入的 onChange 回调到 Store
  // 这样 Store 内部的方法就能调用它
  useEffect(() => {
    setExternalOnChange(onChange);

    // 清理函数：在组件卸载时或 onChange 改变时，清除 Store 中的回调，防止内存泄漏或错误调用。
    return () => {
      setExternalOnChange(undefined);
    }
  }, [onChange, setExternalOnChange]);

  return (
    <ZoomPanEditor
      leftTop={showLegends && (
        <div className="fa-flex-row">
          <Tag color="success">已执行</Tag>
          <Tag color="processing">执行中</Tag>
          <Tag color="default">未执行</Tag>
        </div>
      )}
      toolbar={(
        <Space>
          <BaseDrawer triggerDom={<Button>查看JSON</Button>} title="流程配置JSON" size={600}>
            <JsonView
              value={processModel}
              style={lightTheme}
            />
          </BaseDrawer>
        </Space>
      )}
    >
      <div className={clsx('sc-workflow-design', readOnly && 'sc-workflow-design-readonly')}>
        <div className="box-scale">
          <NodeWrap node={processModel.nodeConfig} />

          <div className="end-node">
            <div className="end-node-circle"></div>
            <div className="end-node-text">流程结束</div>
          </div>
        </div>
      </div>
    </ZoomPanEditor>
  )
}
