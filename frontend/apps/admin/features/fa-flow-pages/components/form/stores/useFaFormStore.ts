import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FaUtils } from '@fa/ui';
import { Flow } from '@/types';
import { Layout, LayoutItem } from 'react-grid-layout';

interface FaFormState {
  flowForm: Flow.FlowForm;
  config: Flow.FlowFormConfig;
  layout: Layout;
  formItemMap: Record<string, Flow.FlowFormItem>;
  selectedFormItem?: Flow.FlowFormItem;
  initialized: boolean;
  // 初始化配置
  init: (flowForm: Flow.FlowForm) => void;
  // 添加表单项
  addFormItem: (type: 'input' | 'row', item: LayoutItem, layout: Layout) => void;
  // 删除表单项
  removeFormItem: (id: string) => void;
  // 更新表单项
  updateFormItem: (id: string, item: Partial<Flow.FlowFormItem>) => void;
  // 添加子项到行容器
  addChildToRow: (rowId: string, type: 'input' | 'row') => void;
  // 从行中删除子项
  removeChildFromRow: (rowId: string, childId: string) => void;
  // 重新排序表单项
  reorderFormItems: (items: Flow.FlowFormItem[]) => void;
  // 重新排序行内的子项
  reorderRowChildren: (rowId: string, children: Flow.FlowFormItem[]) => void;
  // 将子项从一个行移动到另一个行
  moveChildBetweenRows: (sourceRowId: string, targetRowId: string, childId: string) => void;
  // 将子项从行移动到主表单
  moveChildFromRowToForm: (rowId: string, childId: string) => void;
  // 将主表单项目移动到行内
  moveFormItemToRow: (formItemId: string, rowId: string) => void;
  // 清空表单
  clearFormItems: () => void;

  setLayout: (layout: Layout) => void;
  setSelectedFormItem: (item?: Flow.FlowFormItem) => void;
  updateSelectedFormItem: (updates: Partial<Flow.FlowFormItem>) => void;
}

export const useFaFormStore = create<FaFormState>()(
  devtools<FaFormState>(
    (set, get) => ({
      flowForm: {} as Flow.FlowForm,
      config: {} as Flow.FlowFormConfig,
      layout: [],
      formItemMap: {},
      selectedFormItem: undefined,
      initialized: false,

      init: (flowForm) =>
        set(() => ({
          flowForm,
          config: flowForm?.config || {},
          layout: flowForm?.config?.layout || [],
          formItemMap: flowForm?.config?.formItemMap || {},
          formItems: flowForm?.config?.formItems || [],
          initialized: true,
        })),

      addFormItem: (type, itemLayout, layout) =>
        set((state) => {
          const newItem: Flow.FlowFormItem = {
            id: FaUtils.generateId(),
            type,
          };
          const newFormItemMap = { ...state.formItemMap, [newItem.id]: newItem };
          const h = ['row', 'textarea'].includes(type) ? 2 : 1;
          const newLayout = [
            ...layout.filter((l) => l.i !== itemLayout.i),
            { ...itemLayout, h, i: newItem.id },
          ];
          console.log('添加表单项，更新布局：', newLayout);
          return {
            formItemMap: newFormItemMap,
            layout: newLayout,
            config: {
              ...state.config,
              layout: newLayout,
              formItemMap: newFormItemMap,
            },
          };
        }),

      removeFormItem: (id) =>
        set((state) => {
          const newLayout = state.layout.filter((item) => item.i !== id);
          const newFormItemMap = { ...state.formItemMap };
          delete newFormItemMap[id];

          return {
            layout: newLayout,
            formItemMap: newFormItemMap,
            config: {
              ...state.config,
              layout: newLayout,
              formItemMap: newFormItemMap,
            },
          };
        }),

      updateFormItem: (id, updates) =>
        set((state) => ({
        })),

      addChildToRow: (rowId, type) =>
        set((state) => ({
        })),

      removeChildFromRow: (rowId, childId) =>
        set((state) => ({
        })),

      reorderFormItems: (items) =>
        set(() => ({
        })),

      reorderRowChildren: (rowId, children) =>
        set((state) => ({
        })),

      moveChildBetweenRows: (sourceRowId, targetRowId, childId) =>
        set((state) => ({
        })),

      moveChildFromRowToForm: (rowId, childId) =>
        set((state) => ({
        })),

      moveFormItemToRow: (formItemId, rowId) =>
        set((state) => {
        }),

      setLayout: (layout) =>
        set((state) => {
          return {
            layout,
          };
        }),

      setSelectedFormItem: (item) =>
        set(() => ({
          selectedFormItem: item,
        })),
      updateSelectedFormItem: (updates) =>
        set((state) => {
          // 如果没有选中项，直接返回
          if (!state.selectedFormItem) return state;
          return {
            selectedFormItem: { ...state.selectedFormItem, ...updates },
          };
        }),

      clearFormItems: () =>
        set(() => ({
          initialized: false,
          flowForm: {} as Flow.FlowForm,
          config: {} as Flow.FlowFormConfig,
          layout: [],
          formItemMap: {},
        })),
    }),
    { name: 'FaFormStore' }
  )
);
