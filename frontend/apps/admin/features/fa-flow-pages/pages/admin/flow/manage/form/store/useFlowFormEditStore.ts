import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Flow } from '@/types'
import { flowFormApi } from '@/services';

interface FlowFormEditState {
  flowForm: Flow.FlowForm | null;
  setFlowForm: (flowForm: Flow.FlowForm) => void;
  updateFlowFormTableConfig: (flowForm: Flow.FlowForm) => void;
  updateFlowFormTableConfigColumn: (column: Flow.TableConfiQueryColumn) => void;
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
      updateFlowFormTableConfigColumn: (column: Flow.TableConfiQueryColumn) => set((state) => {
        if (!state.flowForm) return {};
        const columns = state.flowForm.tableConfig?.query?.columns || [];
        const index = columns.findIndex(c => c.field === column.field);
        if (index === -1) return {};
        columns[index] = column;
        const newFlowForm = {
          ...state.flowForm,
          tableConfig: {
            ...state.flowForm.tableConfig,
            query: {
              ...state.flowForm.tableConfig?.query,
              columns,
            },
          },
        };
        flowFormApi.update(state.flowForm.id, { tableConfig: newFlowForm.tableConfig })
        return { flowForm: newFlowForm }
      }),
      clear: () => set({ flowForm: null }),
    }),
    { name: 'FlowFormEditStore' }
  )
)
