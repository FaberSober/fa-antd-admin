import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Flow } from '@/types'
import { flowFormApi } from '@/services';

interface FlowFormEditState {
  flowForm: Flow.FlowForm | null;
  setFlowForm: (flowForm: Flow.FlowForm) => void;
  updateFlowFormTableConfig: (flowForm: Flow.FlowForm) => void;
  clear: () => void;
}

export const useFlowFormEditStore = create(
  devtools<FlowFormEditState>(
    (set) => ({
      flowForm: null,
      setFlowForm: (flowForm: Flow.FlowForm) => set({ flowForm }),
      updateFlowFormTableConfig: (flowForm: Flow.FlowForm) => set((state) => {
        flowFormApi.update(state.flowForm!.id, { tableConfig: flowForm.tableConfig })
        return { flowForm }
      }),
      clear: () => set({ flowForm: null }),
    }),
    { name: 'FlowFormEditStore' }
  )
)
