import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Flow } from '@/types'

interface FlowFormEditState {
  flowForm: Flow.FlowForm | null
  setFlowForm: (flowForm: Flow.FlowForm) => void
  clear: () => void
}

export const useFlowFormEditStore = create(
  devtools<FlowFormEditState>(
    (set) => ({
      flowForm: null,
      setFlowForm: (flowForm: Flow.FlowForm) => set({ flowForm }),
      clear: () => set({ flowForm: null }),
    }),
    { name: 'FlowFormEditStore' }
  )
)
