import { createContext } from 'react';
import { Flow } from "@features/fa-flow-pages/types";


export interface FaWorkFlowContextProps {
  /** workflow config */
  processModel: Flow.ProcessModel;
  updateProcessModel: (v: Flow.ProcessModel) => void;
  refreshNode: () => void;
  deleteNode: (n: Flow.Node) => void;
  // updateNode: (node: Flow.Node) => void;
}

export const FaWorkFlowContext = createContext<FaWorkFlowContextProps>({} as any);

export default FaWorkFlowContext;
