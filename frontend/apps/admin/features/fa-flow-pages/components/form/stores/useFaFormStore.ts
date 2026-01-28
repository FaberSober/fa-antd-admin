import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FaUtils } from '@fa/ui';
import { Flow } from '@/types';
import { Layout, LayoutItem } from 'react-grid-layout';
import { findFormItemById, updateFormItemById } from '../utils';

interface FaFormState {
  flowForm: Flow.FlowForm;
  config: Flow.FlowFormConfig;
  selectedFormItem?: Flow.FlowFormItem;
  initialized: boolean;
  // 拖拽状态
  draggedId: string | null;
  dragOverId: string | null;
  // 选中的表单项 ID
  selectedItemId: string | null;
  // 初始化配置
  init: (flowForm: Flow.FlowForm) => void;
  // 添加表单项
  addFormItem: (type: Flow.FlowFormItemType, item: LayoutItem, layout: Layout) => void;
  // 删除表单项
  removeFormItem: (id: string) => void;
  // 更新表单项
  updateFormItem: (id: string, item: Partial<Flow.FlowFormItem>) => void;
  // 更新表单项
  updateFormItems: (items: Flow.FlowFormItem[]) => void;
  // 更新表单项的 children
  updateFormItemChildren: (id: string, children: Flow.FlowFormItem[]) => void;
  // 更新表单配置
  updateFormConfig: (config: Partial<Flow.FlowFormProperty>) => void;
  // 清空配置
  clearConfig: () => void;
  // 清空表单
  clearFormItems: () => void;
  setLayout: (layout: Layout) => void;
  setSelectedFormItem: (item?: Flow.FlowFormItem) => void;
  updateSelectedFormItem: (updates: Partial<Flow.FlowFormItem>) => void;
  // 设置拖拽状态
  setDraggedId: (id: string | null) => void;
  setDragOverId: (id: string | null) => void;
  // 设置选中的表单项 ID
  setSelectedItemId: (id: string | null) => void;
}

export const useFaFormStore = create<FaFormState>()(
  devtools<FaFormState>(
    (set, get) => ({
      flowForm: {} as Flow.FlowForm,
      config: {} as Flow.FlowFormConfig,
      selectedFormItem: undefined,
      initialized: false,
      draggedId: null,
      dragOverId: null,
      selectedItemId: null,

      init: (flowForm) =>
        set(() => ({
          flowForm,
          config: flowForm?.config || {},
          initialized: true,
        })),

      addFormItem: (type, itemLayout, layout) =>
        set((state) => {
          const newItem: Flow.FlowFormItem = {
            id: type + '_' + layout.length + '_' + FaUtils.generateId(4),
            type,
            label: undefined, // 这里要根据 type 设置默认 label
          };
          const newFormItemMap = { ...state.config.formItemMap, [newItem.id]: newItem };
          let h = 1;
          if (['row', 'textarea', 'imageupload'].includes(type)) {
            h = 2;
          } else if (['richtext'].includes(type)) {
            h = 3;
          }
          const newLayout = [
            ...layout.filter((l) => l.i !== itemLayout.i),
            { ...itemLayout, h, i: newItem.id },
          ];
          console.log('添加表单项，更新布局：', newLayout);
          return {
            config: {
              ...state.config,
              layout: newLayout,
              formItemMap: newFormItemMap,
            },
          };
        }),

      removeFormItem: (id) =>
        set((state) => {
          const newLayout = state.config.layout.filter((item) => item.i !== id);
          const newFormItemMap = { ...state.config.formItemMap };
          delete newFormItemMap[id];

          return {
            config: {
              ...state.config,
              layout: newLayout,
              formItemMap: newFormItemMap,
            },
          };
        }),

      updateFormItem: (id, updates) =>
        set((state) => ({
          config: {
            ...state.config,
            formItemMap: {
              ...state.config.formItemMap,
              [id]: { ...state.config.formItemMap[id], ...updates },
            },
          },
        })),
      
      updateFormItems: (items) =>
        set((state) => ({
          config: {
            ...state.config,
            items,
          },
        })),

      updateFormItemChildren: (id, children) =>
        set((state) => {
          const updatedItems = updateFormItemById(
            state.config.items || [],
            id,
            { children }
          );

          return {
            config: {
              ...state.config,
              items: updatedItems,
            },
          };
        }),

      updateFormConfig: (configUpdates) =>
        set((state) => ({
          config: {
            ...state.config,
            formConfig: {
              ...state.config.formConfig,
              ...configUpdates,
            },
          },
        })),

      setLayout: (layout) =>
        set((state) => {
          return {
            config: {
              ...state.config,
              layout,
            },
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
          const newSelectedFormItem = { ...state.selectedFormItem, ...updates };
          
          // 更新 config.items 中的对应项
          const updatedItems = updateFormItemById(
            state.config.items || [],
            state.selectedFormItem.id,
            updates
          );

          return {
            config: {
              ...state.config,
              items: updatedItems,
              formItemMap: {
                ...state.config.formItemMap,
                [state.selectedFormItem.id]: newSelectedFormItem,
              },
            },
            selectedFormItem: newSelectedFormItem,
          };
        }),

      clearConfig: () =>
        set((state) => ({
          config: {
            ...state.config,
            layout: [],
            formItemMap: {},
            items: [],
          },
        })),

      clearFormItems: () =>
        set(() => ({
          initialized: false,
          flowForm: {} as Flow.FlowForm,
          config: {} as Flow.FlowFormConfig,
          layout: [],
          formItemMap: {},
        })),

      setDraggedId: (id) =>
        set(() => ({
          draggedId: id,
        })),

      setDragOverId: (id) =>
        set(() => ({
          dragOverId: id,
        })),

      setSelectedItemId: (id) =>
        set((state) => {
          if (!id) {
            return {
              selectedItemId: null,
              selectedFormItem: undefined,
            };
          }

          const foundItem = findFormItemById(state.config.items || [], id);

          return {
            selectedItemId: id,
            selectedFormItem: foundItem,
          };
        }),
    }),
    { name: 'FaFormStore' }
  )
);
