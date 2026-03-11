// useWsStore.ts (修正版)
import { create } from 'zustand';
import { ReadyState } from 'ahooks/lib/useWebSocket';

// 1. 定义状态和方法结构
interface WebSocketState {
  // 保持状态，但移除所有 Hooks 调用及其依赖
  readyState: ReadyState;
  latestMessageObj: any;
  messageHistory: any[];

  // 保持方法结构，但需要一个外部函数来设置实际的发送逻辑
  sendMessage: (msg: Record<any, any>) => void;
  connect: () => void;
  disconnect: () => void;

  // 新增：用于 Bridge 组件设置方法的函数
  setHandlers: (handlers: {
      sendMessage: (msg: string) => void,
      connect: () => void,
      disconnect: () => void
  }) => void;
}

// 2. 定义 Store
export const useWsStore = create<WebSocketState>((set, get) => ({
    readyState: ReadyState.Closed,
    latestMessageObj: undefined,
    messageHistory: [],

    // 默认空操作，等待 Bridge 组件设置
    sendMessage: () => console.warn('WebSocket not initialized. Call connect() first.'),
    connect: () => console.warn('WebSocket not initialized.'),
    disconnect: () => console.warn('WebSocket not initialized.'),

    // 接收 Bridge 组件注入的实际方法
    setHandlers: (handlers) => set({
        sendMessage: (msg) => handlers.sendMessage(JSON.stringify(msg)),
        connect: handlers.connect,
        disconnect: handlers.disconnect
    }),

    // 其他状态初始化
}));
