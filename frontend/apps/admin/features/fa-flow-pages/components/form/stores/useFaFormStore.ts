import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { FaUtils } from '@fa/ui';
import { Flow } from '@/types';
import { Layout } from 'react-grid-layout';

interface FaFormState {
  flowForm: Flow.FlowForm;
  layout: Layout;
  formItems: Flow.FlowFormItem[];
  selectedFormItem?: Flow.FlowFormItem;
  initialized: boolean;
  // 初始化配置
  init: (flowForm: Flow.FlowForm) => void;
  // 添加表单项
  addFormItem: (type: 'input' | 'row') => void;
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

  setSelectedFormItem: (item?: Flow.FlowFormItem) => void;
  updateSelectedFormItem: (updates: Partial<Flow.FlowFormItem>) => void;
}

export const useFaFormStore = create<FaFormState>()(
  devtools<FaFormState>(
    (set, get) => ({
      flowForm: {} as Flow.FlowForm,
      layout: [],
      formItems: [],
      selectedFormItem: undefined,
      initialized: false,

      init: (flowForm) =>
        set(() => ({
          flowForm,
          formItems: flowForm?.config?.formItems || [],
          initialized: true,
        })),

      addFormItem: (type) =>
        set((state) => ({
          formItems: [...state.formItems, { id: FaUtils.generateId(), type, children: [] }],
        })),

  removeFormItem: (id) =>
    set((state) => ({
      formItems: state.formItems.filter((item) => item.id !== id),
    })),

  updateFormItem: (id, updates) =>
    set((state) => ({
      formItems: state.formItems.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    })),

  addChildToRow: (rowId, type) =>
    set((state) => ({
      formItems: state.formItems.map((item) =>
        item.id === rowId && item.type === 'row'
          ? {
              ...item,
              children: [
                ...(item.children || []),
                { id: FaUtils.generateId(), type, children: [] },
              ],
            }
          : item
      ),
    })),

  removeChildFromRow: (rowId, childId) =>
    set((state) => ({
      formItems: state.formItems.map((item) =>
        item.id === rowId && item.type === 'row'
          ? {
              ...item,
              children: (item.children || []).filter((child) => child.id !== childId),
            }
          : item
      ),
    })),

  reorderFormItems: (items) =>
    set(() => ({
      formItems: items,
    })),

  reorderRowChildren: (rowId, children) =>
    set((state) => ({
      formItems: state.formItems.map((item) =>
        item.id === rowId && item.type === 'row'
          ? { ...item, children }
          : item
      ),
    })),

  moveChildBetweenRows: (sourceRowId, targetRowId, childId) =>
    set((state) => ({
      formItems: state.formItems.map((item) => {
        // 从源行删除子项
        if (item.id === sourceRowId && item.type === 'row') {
          return {
            ...item,
            children: (item.children || []).filter((child) => child.id !== childId),
          };
        }
        // 到目标行添加子项
        if (item.id === targetRowId && item.type === 'row') {
          const childToMove = state.formItems
            .find((sourceItem) => sourceItem.id === sourceRowId && sourceItem.type === 'row')
            ?.children?.find((child) => child.id === childId);

          if (childToMove) {
            return {
              ...item,
              children: [...(item.children || []), childToMove],
            };
          }
        }
        return item;
      }),
    })),

  moveChildFromRowToForm: (rowId, childId) =>
    set((state) => ({
      formItems: state.formItems.map((item) => {
        // 从源行删除子项
        if (item.id === rowId && item.type === 'row') {
          const childToMove = item.children?.find((child) => child.id === childId);
          if (childToMove) {
            // 返回修改后的行（删除子项）
            const newItem = {
              ...item,
              children: (item.children || []).filter((child) => child.id !== childId),
            };
            return newItem;
          }
        }
        return item;
      }).concat(
        // 查找要移动的子项
        state.formItems
          .find((item) => item.id === rowId && item.type === 'row')
          ?.children?.find((child) => child.id === childId) || null
      ).filter((item): item is Flow.FlowFormItem => item !== null),
    })),

  moveFormItemToRow: (formItemId, rowId) =>
    set((state) => {
      // 查找要移动的表单项
      const itemToMove = state.formItems.find((item) => item.id === formItemId);
      if (!itemToMove) return state;

      return {
        formItems: state.formItems
          .filter((item) => item.id !== formItemId) // 从表单顶层移除
          .map((item) => {
            // 添加到目标行
            if (item.id === rowId && item.type === 'row') {
              return {
                ...item,
                children: [...(item.children || []), itemToMove],
              };
            }
            return item;
          }),
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
      // 在formItems中更新选中项
      const updatedFormItems = state.formItems.map((item) => {
        if (item.type === 'row' && item.children) {
          return {
            ...item,
            children: item.children.map((child) =>
              child.id === state.selectedFormItem!.id ? { ...child, ...updates } : child
            ),
          };
        }
        if (item.id === state.selectedFormItem!.id) {
          return { ...item, ...updates };
        }
        return item;
      });
      return {
        formItems: updatedFormItems,
        selectedFormItem: { ...state.selectedFormItem, ...updates },
      };
    }),

  clearFormItems: () =>
    set(() => ({
      flowForm: {} as Flow.FlowForm,
      formItems: [],
      initialized: false,
    })),
    }),
    { name: 'FaFormStore' }
  )
);
