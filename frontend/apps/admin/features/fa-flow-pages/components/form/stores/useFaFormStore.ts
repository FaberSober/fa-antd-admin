import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FaUtils } from '@fa/ui';
import { Flow } from '@/types';
import { Layout, LayoutItem } from 'react-grid-layout';
import { findFormItemById, updateFormItemById, removeFormItemById } from '../utils';

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
  // drop 事件处理标记,用于防止嵌套容器重复处理
  isDropHandling: boolean;
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
  // 设置 drop 事件处理标记
  setIsDropHandling: (isHandling: boolean) => void;
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
      isDropHandling: false,

      init: (flowForm) =>
        set(() => ({
          flowForm,
          config: flowForm?.config || {},
          initialized: true,
        })),

      addFormItem: (type, itemLayout, layout) =>
        set((state) => {
          return {
            config: {
              ...state.config,
            },
          };
        }),

      removeFormItem: (id) =>
        set((state) => {
          // 删除 items 中的条目
          const newItems = removeFormItemById(state.config.items || [], id);

          return {
            config: {
              ...state.config,
              items: newItems,
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

      setIsDropHandling: (isHandling) =>
        set(() => ({
          isDropHandling: isHandling,
        })),
    }),
    { name: 'FaFormStore' }
  )
);
