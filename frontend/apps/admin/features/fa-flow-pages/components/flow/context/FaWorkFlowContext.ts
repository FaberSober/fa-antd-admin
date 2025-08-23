import { createContext } from 'react';
import { Flw } from "@features/fa-flow-pages/types";


export interface FaWorkFlowContextProps {
  /** workflow config */
  processModel: Flw.ProcessModel;
  updateProcessModel: (v: Flw.ProcessModel) => void;
  refreshNode: () => void;
  deleteNode: (n: Flw.Node) => void;
  // updateNode: (node: Flw.Node) => void;
}

export const FaWorkFlowContext = createContext<FaWorkFlowContextProps>({} as any);

export default FaWorkFlowContext;
