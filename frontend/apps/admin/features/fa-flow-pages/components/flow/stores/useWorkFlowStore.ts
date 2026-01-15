// useWorkFlowStore.ts
import { Flow, Flw } from '@features/fa-flow-pages/types';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { loopNode } from '../utils';


// 1. 定义状态和方法结构
interface WorkFlowState {
  /** 流程配置 */
  flowProcess: Flow.FlowProcess;
  /** workflow config */
  processModel: Flw.ProcessModel;
  /** 外部 onChange 回调函数，用于通知父组件数据变化 */
  onChange: ((v: Flw.ProcessModel) => void) | undefined;

  // 动作方法
  setFlowProcess: (v: Flow.FlowProcess) => void;
  setProcessModel: (v: Flw.ProcessModel) => void;
  setExternalOnChange: (cb: ((v: Flw.ProcessModel) => void) | undefined) => void;
  refreshNode: () => void;
  deleteNode: (node: Flw.Node) => void;
  updateNodeProps: (node: Flw.Node, path: keyof Flw.Node | any, value: any) => void;
  updateNode: (node: Flw.Node | Flw.ConditionNode) => void;
  updateNodeConfig: (updater: (draft: Flw.ProcessModel) => void) => void;
  clear: () => void;

  /** 流程task节点状态(适用于进行中的流程展示流程节点运行状态) */
  renderNodes?: Record<string, '0' | '1'>;
  setRenderNodes: (v: Record<string, '0' | '1'>) => void;

  readOnly: boolean;
  setReadOnly: (v: boolean) => void;
}

// 2. 定义 Store
export const useWorkFlowStore = create<WorkFlowState>()(
  devtools(
    immer((set, get) => ({
      // ✅ 状态属性初始值
      flowProcess: {} as Flow.FlowProcess,
      processModel: {} as Flw.ProcessModel,
      renderNodes: {},
      readOnly: false,
      onChange: undefined,

      // ✅ 动作方法实现
      setFlowProcess: (v) => set((state) => { state.flowProcess = v; }),
      setExternalOnChange: (cb) => set((state) => { state.onChange = cb; }),
      setProcessModel: (v) => set((state) => { state.processModel = v; }),
      setRenderNodes: (v) => set((state) => { state.renderNodes = v || {}; }),
      setReadOnly: (v) => set((state) => { state.readOnly = v; }),

      refreshNode: () => {
        set(() => {}); // 强制刷新（Immer 下空更新触发渲染）
        get().onChange?.(get().processModel);
      },

      deleteNode: (node: Flw.Node) => {
        set((state) => {
          // loopNode 内部必须是修改 state.processModel.nodeConfig 的逻辑
          loopNode(state.processModel.nodeConfig, (n) => {
            if (n.childNode?.nodeKey === node.nodeKey) {
              n.childNode = n.childNode.childNode;
            }
          });
        });
        // ✅ 触发外部 onChange
        get().onChange?.(get().processModel);
      },

      updateNode: (node: Flw.Node) => {
        set((state) => {
          loopNode(state.processModel.nodeConfig, (n) => {
            if (n.nodeKey === node.nodeKey) {
              Object.assign(n, node);
            }
          });
        });
        get().onChange?.(get().processModel);
      },

      updateNodeProps: (node: Flw.Node, path: keyof Flw.Node | any, value: any) => {
        set((state) => {
          loopNode(state.processModel.nodeConfig, (n) => {
            if (n.nodeKey === node.nodeKey) {
              (n as any)[path] = value;
            }
          });
        });
        get().onChange?.(get().processModel);
      },

      updateNodeConfig: (updater: (draft: Flw.ProcessModel) => void) => {
        set((state) => {
          updater(state.processModel); // 在 draft.processModel 上执行 updater
        });
        get().onChange?.(get().processModel);
      },

      clear: () => {
        set({
          flowProcess: {} as Flow.FlowProcess,
          processModel: {} as Flw.ProcessModel,
          renderNodes: {},
          readOnly: false,
          onChange: undefined,
        });
      },
    })
  ), { name: 'WorkFlow Store' })
);
