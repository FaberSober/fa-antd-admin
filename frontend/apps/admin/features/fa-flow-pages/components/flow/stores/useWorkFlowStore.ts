// useWorkFlowStore.ts
import { Flw } from '@features/fa-flow-pages/types';
import { cloneDeep } from 'lodash';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

function loopNode(n: Flw.Node, func: (n: Flw.Node) => void) {
  if (n.childNode) {
    loopNode(n.childNode, func)
  }
  func(n)
}

// 1. 定义状态和方法结构
interface WorkFlowState {
  /** workflow config */
  processModel: Flw.ProcessModel;
  /** 外部 onChange 回调函数，用于通知父组件数据变化 */
  onChange: ((v: Flw.ProcessModel) => void) | undefined;

  // 动作方法
  setProcessModel: (v: Flw.ProcessModel) => void;
  setExternalOnChange: (cb: ((v: Flw.ProcessModel) => void) | undefined) => void;
  refreshNode: () => void;
  deleteNode: (node: Flw.Node) => void;
  updateNodeConfig: (updater: (draft: Flw.ProcessModel) => void) => void;

  /** 流程task节点状态(适用于进行中的流程展示流程节点运行状态) */
  renderNodes?: Record<string, '0' | '1'>;
  setRenderNodes: (v: Record<string, '0' | '1'>) => void;

  readOnly: boolean;
  setReadOnly: (v: boolean) => void;
}

// 2. 定义 Store
export const useWorkFlowStore = create<WorkFlowState>()(
  devtools<WorkFlowState>((set, get) => ({
    // ✅ 状态属性初始值
    processModel: {} as Flw.ProcessModel,
    renderNodes: {},
    readOnly: false,
    onChange: undefined,

    // ✅ 动作方法实现
    setExternalOnChange: (cb) => {
      set({ onChange: cb }, false, 'setExternalOnChange');
    },

    setProcessModel: (v: Flw.ProcessModel) => {
      set({ processModel: v });
      // 注意：此处不应该调用 onChange，因为这是父组件初始化的数据
    },
    setRenderNodes: (v: Record<string, '0' | '1'>) => {
      set({ renderNodes: v||{} });
    },
    setReadOnly: (v: boolean) => {
      set({ readOnly: v })
    },

    refreshNode: () => {
      const processModel = get().processModel;
      // 必须深拷贝，触发 React 重新渲染
      const newModel = cloneDeep(processModel);
      set({ processModel: newModel });
      // ✅ 触发外部 onChange
      get().onChange?.(newModel);
    },

    deleteNode: (node: Flw.Node) => {
      // delete current node, move child node forward
      const processModel = get().processModel;
      loopNode(processModel.nodeConfig, n => {
        if (n.childNode && n.childNode.nodeKey === node.nodeKey) {
          n.childNode = n.childNode.childNode
        }
      })

      // 必须深拷贝，触发 React 重新渲染
      const newModel = cloneDeep(processModel);
      set({ processModel: newModel });
      // ✅ 触发外部 onChange
      get().onChange?.(newModel);
    },

    updateNodeConfig: (updater: (draft: Flw.ProcessModel) => void) => {
      const currentModel = get().processModel;
      const newModel = cloneDeep(currentModel);

      updater(newModel); // 对新的模型进行修改

      set({ processModel: newModel });
      get().onChange?.(newModel);
    },
  }), { name: 'WorkFlow Store' })
);
