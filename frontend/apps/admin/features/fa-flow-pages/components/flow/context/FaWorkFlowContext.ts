import { createContext } from 'react';
import { Flw, FlwEnums } from "@features/fa-flow-pages/types";


export interface FaWorkFlowContextProps {
  /** workflow config */
  processModel: Flw.ProcessModel;
  updateProcessModel: (v: Flw.ProcessModel) => void;
  refreshNode: () => void;
  deleteNode: (n: Flw.Node) => void;
  // updateNode: (node: Flw.Node) => void;
  /** 流程task节点状态(适用于进行中的流程展示流程节点运行状态) */
  renderNodes?: Record<string, '0' | '1'>;
}

export const FaWorkFlowContext = createContext<FaWorkFlowContextProps>({} as any);

export default FaWorkFlowContext;
